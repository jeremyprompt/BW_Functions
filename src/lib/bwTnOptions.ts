const BANDWIDTH_API_BASE = 'https://api.bandwidth.com/api/v2';

interface BwCreds {
  username: string;
  password: string;
  accountId: string;
}

function getBwCreds(): BwCreds {
  const username = process.env.BANDWIDTH_USERNAME;
  const password = process.env.BANDWIDTH_PASSWORD;
  const accountId = process.env.BANDWIDTH_ACCOUNT_ID;

  const missing: string[] = [];
  if (!username) missing.push('BANDWIDTH_USERNAME');
  if (!password) missing.push('BANDWIDTH_PASSWORD');
  if (!accountId) missing.push('BANDWIDTH_ACCOUNT_ID');

  if (missing.length > 0) {
    throw new Error(
      `Missing Bandwidth credentials. Please set the following environment variables in Vercel: ${missing.join(', ')}`
    );
  }

  return { username, password, accountId };
}

function getAuthHeader(creds: BwCreds): string {
  const credentials = Buffer.from(`${creds.username}:${creds.password}`).toString('base64');
  return `Basic ${credentials}`;
}

export async function addCampaignToTns(params: {
  campaignId: string;
  phoneNumbers: string[];
  sms?: 'ON' | 'OFF';
}) {
  const { campaignId, phoneNumbers, sms = 'ON' } = params;
  const creds = getBwCreds();

  const url = `${BANDWIDTH_API_BASE}/accounts/${creds.accountId}/tnOptions`;

  const payload = {
    customerOrderId: 'TnOptionOrder_AddCampaign',
    tnOptionGroups: [
      {
        sms,
        a2pSettings: {
          action: 'AS_SPECIFIED',
          campaignId,
        },
        phoneNumbers,
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(creds),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    rawResponse: text,
  };
}

export async function removeCampaignFromTns(params: {
  phoneNumbers: string[];
  sms?: 'ON' | 'OFF';
}) {
  const { phoneNumbers, sms = 'ON' } = params;
  const creds = getBwCreds();

  const url = `${BANDWIDTH_API_BASE}/accounts/${creds.accountId}/tnOptions`;

  const payload = {
    customerOrderId: 'TnOptionOrder_RemoveCampaign',
    tnOptionGroups: [
      {
        sms,
        a2pSettings: {
          action: 'SYSTEM_DEFAULT',
        },
        phoneNumbers,
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(creds),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    rawResponse: text,
  };
}

export async function transferTns(params: {
  subAccountId: number;
  locationId: number;
  phoneNumbers: string[];
}) {
  const { subAccountId, locationId, phoneNumbers } = params;
  const creds = getBwCreds();

  const url = `${BANDWIDTH_API_BASE}/accounts/${creds.accountId}/moveTns`;

  const payload = {
    subAccountId,
    locationId,
    phoneNumbers,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(creds),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    rawResponse: text,
  };
}

