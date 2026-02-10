/**
 * Bandwidth API Client
 * 
 * This module provides functions to interact with the Bandwidth API.
 * Uses the same credentials as bwTnOptions (username/password basic auth).
 * Make sure to set the following environment variables:
 * - BANDWIDTH_USERNAME
 * - BANDWIDTH_PASSWORD
 * - BANDWIDTH_ACCOUNT_ID
 */

const BANDWIDTH_API_BASE = 'https://api.bandwidth.com';

interface BandwidthConfig {
  username: string;
  password: string;
  accountId: string;
}

function getBandwidthConfig(): BandwidthConfig {
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

  // TypeScript doesn't know these are defined after the check, so we assert they're strings
  return { 
    username: username!, 
    password: password!, 
    accountId: accountId! 
  };
}

function getAuthHeader(): string {
  const { username, password } = getBandwidthConfig();
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${credentials}`;
}

export async function checkApiStatus() {
  const { accountId } = getBandwidthConfig();
  const authHeader = getAuthHeader();

  try {
    // Try the v2 API endpoint which uses accountId directly
    const response = await fetch(`${BANDWIDTH_API_BASE}/api/v2/accounts/${accountId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    // Bandwidth API v2 returns XML, try to parse as JSON first, fallback to text
    try {
      return {
        success: true,
        data: JSON.parse(data),
      };
    } catch {
      return {
        success: true,
        data: { raw: data },
      };
    }
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
    // Use v2 API endpoint
    const response = await fetch(`${BANDWIDTH_API_BASE}/api/v2/accounts/${accountId}/phoneNumbers`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    // Bandwidth API v2 returns XML, try to parse as JSON first, fallback to text
    try {
      return {
        success: true,
        data: JSON.parse(data),
      };
    } catch {
      return {
        success: true,
        data: { raw: data },
      };
    }
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
    // Use v2 API endpoint
    const response = await fetch(`${BANDWIDTH_API_BASE}/api/v2/accounts/${accountId}/messages`, {
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

    const data = await response.text();
    // Bandwidth API v2 returns XML, try to parse as JSON first, fallback to text
    try {
      return {
        success: true,
        data: JSON.parse(data),
      };
    } catch {
      return {
        success: true,
        data: { raw: data },
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
