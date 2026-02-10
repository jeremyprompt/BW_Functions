import requests
from requests.auth import HTTPBasicAuth
import json
import xml.etree.ElementTree as ET

# Replace these with your actual Bandwidth API credentials
username = 'jeremyApi'
password = 'Arglebargle7!'

# API endpoint for TnOptionOrder
# Try using the same base pattern as moveTns: /api/v2/accounts/{accountId}/tnOptions
url = "https://api.bandwidth.com/api/v2/accounts/5005456/tnOptions"

# JSON payload matching Bandwidth API structure
# Set sms to "OFF" if disabling SMS, "ON" if enabling
# Action "SYSTEM_DEFAULT" specifies delete campaign
payload = {
    "customerOrderId": "TnOptionOrder1",
    "tnOptionGroups": [
        {
            "sms": "ON",  # or "OFF" if disabling SMS
            "a2pSettings": {
                "action": "SYSTEM_DEFAULT",  # specifies delete campaign
            },
            "phoneNumbers": [
                "+12549465498",
                "+13612714600"
            ]
        }
    ]
}

# Debug: Print request details
print(f"URL: {url}")
print(f"Payload:\n{json.dumps(payload, indent=2)}\n")

response = requests.post(url, auth=HTTPBasicAuth(username, password), json=payload)

# Check the status code first
print(f"Status Code: {response.status_code}")

# Bandwidth API returns XML, not JSON
if response.status_code == 201:
    print("✓ Campaign removal order created successfully!")
    
    # Parse XML response
    try:
        root = ET.fromstring(response.text)
        order = root.find('TnOptionOrder')
        
        if order is not None:
            order_id = root.find('OrderId')
            status = root.find('ProcessingStatus')
            
            print(f"\nOrder Details:")
            if order_id is not None:
                print(f"  Order ID: {order_id.text}")
            if status is not None:
                print(f"  Status: {status.text}")
            
            # Check for errors
            errors = root.find('Errors')
            if errors is not None and len(errors) > 0:
                print(f"\n⚠ Errors found:")
                for error in errors:
                    error_text = error.text if error.text else error.find('Error').text if error.find('Error') is not None else str(error)
                    print(f"  - {error_text}")
            
            # Check for warnings
            warnings = root.find('Warnings')
            if warnings is not None and len(warnings) > 0:
                print(f"\n⚠ Warnings found:")
                for warning in warnings:
                    warning_text = warning.text if warning.text else warning.find('Warning').text if warning.find('Warning') is not None else str(warning)
                    print(f"  - {warning_text}")
            
            # Show phone numbers
            phone_numbers = order.find('TelephoneNumbers')
            if phone_numbers is not None:
                print(f"\nPhone Numbers:")
                for tn in phone_numbers.findall('TelephoneNumber'):
                    print(f"  - {tn.text}")
    except ET.ParseError as e:
        print(f"Error parsing XML: {e}")
        print(f"Raw response: {response.text}")
else:
    print(f"✗ Request failed with status {response.status_code}")
    print(f"Response: {response.text}")
