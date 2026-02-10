import requests
from requests.auth import HTTPBasicAuth
import json
import xml.etree.ElementTree as ET

# Replace these with your actual Bandwidth API credentials
username = ''
password = ''

# API endpoint for the specific phone number
url = "https://api.bandwidth.com/api/v2/accounts/{accountId}/moveTns"

payload = {
"subAccountId": 33376,
"locationId": 1127896,
"phoneNumbers": [
"+12022401194",
"+12022351122"
]
}

response = requests.post(url, auth=HTTPBasicAuth(username, password), json=payload)

# Check the status code first
print(f"Status Code: {response.status_code}")

# Bandwidth API returns XML, not JSON
if response.status_code == 201:
    print("✓ Transfer order created successfully!")
    
    # Parse XML response
    try:
        root = ET.fromstring(response.text)
        order = root.find('MoveTnsOrder')
        
        if order is not None:
            order_id = order.find('OrderId')
            status = order.find('ProcessingStatus')
            site_id = order.find('SiteId')
            sip_peer_id = order.find('SipPeerId')
            
            print(f"\nOrder Details:")
            if order_id is not None:
                print(f"  Order ID: {order_id.text}")
            if status is not None:
                print(f"  Status: {status.text}")
            if site_id is not None:
                print(f"  Site ID: {site_id.text}")
            if sip_peer_id is not None:
                print(f"  SIP Peer ID: {sip_peer_id.text}")
            
            # Check for errors
            errors = order.find('Errors')
            if errors is not None and len(errors) > 0:
                print(f"\n⚠ Errors found:")
                for error in errors:
                    print(f"  - {error.text}")
            
            # Check for warnings
            warnings = order.find('Warnings')
            if warnings is not None and len(warnings) > 0:
                print(f"\n⚠ Warnings found:")
                for warning in warnings:
                    print(f"  - {warning.text}")
            
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