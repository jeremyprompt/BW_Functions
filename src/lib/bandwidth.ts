/**
 * Bandwidth API Client
 * 
 * This module provides functions to interact with the Bandwidth API.
 * Make sure to set the following environment variables:
 * - BANDWIDTH_USER_ID
 * - BANDWIDTH_API_TOKEN
 * - BANDWIDTH_API_SECRET
 * - BANDWIDTH_ACCOUNT_ID
 */

const BANDWIDTH_API_BASE = 'https://api.bandwidth.com';

interface BandwidthConfig {
  userId: string;
  apiToken: string;
  apiSecret: string;
  accountId: string;
}

function getBandwidthConfig(): BandwidthConfig {
  const userId = process.env.BANDWIDTH_USER_ID;
  const apiToken = process.env.BANDWIDTH_API_TOKEN;
  const apiSecret = process.env.BANDWIDTH_API_SECRET;
  const accountId = process.env.BANDWIDTH_ACCOUNT_ID;

  if (!userId || !apiToken || !apiSecret || !accountId) {
    throw new Error('Missing required Bandwidth API credentials. Please set BANDWIDTH_USER_ID, BANDWIDTH_API_TOKEN, BANDWIDTH_API_SECRET, and BANDWIDTH_ACCOUNT_ID environment variables.');
  }

  return { userId, apiToken, apiSecret, accountId };
}

function getAuthHeader(): string {
  const { apiToken, apiSecret } = getBandwidthConfig();
  const credentials = Buffer.from(`${apiToken}:${apiSecret}`).toString('base64');
  return `Basic ${credentials}`;
}

export async function checkApiStatus() {
  const { accountId } = getBandwidthConfig();
  const authHeader = getAuthHeader();

  try {
    const response = await fetch(`${BANDWIDTH_API_BASE}/v1/users/${accountId}/account`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getPhoneNumbers() {
  const { accountId } = getBandwidthConfig();
  const authHeader = getAuthHeader();

  try {
    const response = await fetch(`${BANDWIDTH_API_BASE}/v1/users/${accountId}/phoneNumbers`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendMessage(to: string, from: string, text: string) {
  const { accountId } = getBandwidthConfig();
  const applicationId = process.env.BANDWIDTH_APPLICATION_ID;
  const authHeader = getAuthHeader();

  if (!applicationId) {
    throw new Error('BANDWIDTH_APPLICATION_ID environment variable is required for sending messages');
  }

  try {
    const response = await fetch(`${BANDWIDTH_API_BASE}/v1/users/${accountId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        from,
        text,
        applicationId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
