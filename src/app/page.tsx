'use client';

import { useState } from 'react';

type Tab = 'add' | 'remove' | 'transfer';

interface ParsedResponse {
  orderId?: string;
  processingStatus?: string;
  errors: string[];
  warnings: string[];
  phoneNumbers: string[];
}

interface ApiResponse {
  status: 'success' | 'error';
  httpStatus?: number;
  httpStatusText?: string;
  rawResponse?: string;
  message?: string;
  error?: string;
  parsed?: ParsedResponse;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  // Add Campaign state
  const [campaignId, setCampaignId] = useState('');
  const [addPhoneNumbers, setAddPhoneNumbers] = useState('');
  const [addSms, setAddSms] = useState<'ON' | 'OFF'>('ON');

  // Remove Campaign state
  const [removePhoneNumbers, setRemovePhoneNumbers] = useState('');
  const [removeSms, setRemoveSms] = useState<'ON' | 'OFF'>('ON');

  // Transfer TNs state
  const [subAccountId, setSubAccountId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [transferPhoneNumbers, setTransferPhoneNumbers] = useState('');

  const parsePhoneNumbers = (input: string): string[] => {
    return input
      .split(/[,\n]/)
      .map(num => num.trim())
      .filter(num => num.length > 0);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation: should start with + and contain digits
    return /^\+[1-9]\d{1,14}$/.test(phone);
  };

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const phoneNumbers = parsePhoneNumbers(addPhoneNumbers);
    if (!campaignId || phoneNumbers.length === 0) {
      setResponse({
        status: 'error',
        error: 'Campaign ID and at least one phone number are required',
      });
      setLoading(false);
      return;
    }

    // Validate phone numbers
    const invalidNumbers = phoneNumbers.filter(num => !validatePhoneNumber(num));
    if (invalidNumbers.length > 0) {
      setResponse({
        status: 'error',
        error: `Invalid phone number format: ${invalidNumbers.join(', ')}. Phone numbers must start with + and be in E.164 format.`,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/bandwidth/add-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaignId.trim(),
          phoneNumbers,
          sms: addSms,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const phoneNumbers = parsePhoneNumbers(removePhoneNumbers);
    if (phoneNumbers.length === 0) {
      setResponse({
        status: 'error',
        error: 'At least one phone number is required',
      });
      setLoading(false);
      return;
    }

    // Validate phone numbers
    const invalidNumbers = phoneNumbers.filter(num => !validatePhoneNumber(num));
    if (invalidNumbers.length > 0) {
      setResponse({
        status: 'error',
        error: `Invalid phone number format: ${invalidNumbers.join(', ')}. Phone numbers must start with + and be in E.164 format.`,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/bandwidth/remove-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumbers,
          sms: removeSms,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransferTns = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const phoneNumbers = parsePhoneNumbers(transferPhoneNumbers);
    const subAccountIdNum = parseInt(subAccountId);
    const locationIdNum = parseInt(locationId);

    if (!subAccountIdNum || !locationIdNum || phoneNumbers.length === 0) {
      setResponse({
        status: 'error',
        error: 'Sub Account ID, Location ID, and at least one phone number are required',
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/bandwidth/transfer-tns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subAccountId: subAccountIdNum,
          locationId: locationIdNum,
          phoneNumbers,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Bandwidth Functions
        </h1>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => {
                  setActiveTab('add');
                  setResponse(null);
                }}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'add'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Add Campaign
              </button>
              <button
                onClick={() => {
                  setActiveTab('remove');
                  setResponse(null);
                }}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'remove'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Remove Campaign
              </button>
              <button
                onClick={() => {
                  setActiveTab('transfer');
                  setResponse(null);
                }}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'transfer'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Transfer TNs
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Add Campaign Form */}
            {activeTab === 'add' && (
              <form onSubmit={handleAddCampaign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Campaign ID *
                  </label>
                  <input
                    type="text"
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., C123456"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Numbers * (one per line or comma-separated)
                  </label>
                  <textarea
                    value={addPhoneNumbers}
                    onChange={(e) => setAddPhoneNumbers(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="+12345678910"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMS Setting
                  </label>
                  <select
                    value={addSms}
                    onChange={(e) => setAddSms(e.target.value as 'ON' | 'OFF')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="ON">ON</option>
                    <option value="OFF">OFF</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Add Campaign'}
                </button>
              </form>
            )}

            {/* Remove Campaign Form */}
            {activeTab === 'remove' && (
              <form onSubmit={handleRemoveCampaign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Numbers * (one per line or comma-separated)
                  </label>
                  <textarea
                    value={removePhoneNumbers}
                    onChange={(e) => setRemovePhoneNumbers(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="+12345678910"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMS Setting
                  </label>
                  <select
                    value={removeSms}
                    onChange={(e) => setRemoveSms(e.target.value as 'ON' | 'OFF')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="ON">ON</option>
                    <option value="OFF">OFF</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Remove Campaign'}
                </button>
              </form>
            )}

            {/* Transfer TNs Form */}
            {activeTab === 'transfer' && (
              <form onSubmit={handleTransferTns} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sub Account ID *
                  </label>
                  <input
                    type="number"
                    value={subAccountId}
                    onChange={(e) => setSubAccountId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., 33376"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location ID *
                  </label>
                  <input
                    type="number"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., 1127896"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Numbers * (one per line or comma-separated)
                  </label>
                  <textarea
                    value={transferPhoneNumbers}
                    onChange={(e) => setTransferPhoneNumbers(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="+12022401194&#10;+12022351122"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Transfer TNs'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Response Display */}
        {response && (
          <div
            className={`p-4 rounded-lg ${
              response.status === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <h3
              className={`font-semibold mb-3 ${
                response.status === 'success'
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-red-800 dark:text-red-300'
              }`}
            >
              {response.status === 'success' ? '✓ Success' : '✗ Error'}
            </h3>
            
            {/* Parsed Response Details */}
            {response.parsed && (
              <div className="mb-4 space-y-2">
                {response.parsed.orderId && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Order ID:</span>{' '}
                    <span className="text-gray-900 dark:text-gray-100">{response.parsed.orderId}</span>
                  </div>
                )}
                {response.parsed.processingStatus && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>{' '}
                    <span className="text-gray-900 dark:text-gray-100">{response.parsed.processingStatus}</span>
                  </div>
                )}
                {response.parsed.phoneNumbers.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Phone Numbers:</span>
                    <ul className="list-disc list-inside mt-1 text-gray-900 dark:text-gray-100">
                      {response.parsed.phoneNumbers.map((num, idx) => (
                        <li key={idx}>{num}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {response.parsed.errors.length > 0 && (
                  <div className="text-sm mt-2">
                    <span className="font-medium text-red-700 dark:text-red-400">Errors:</span>
                    <ul className="list-disc list-inside mt-1 text-red-600 dark:text-red-500">
                      {response.parsed.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {response.parsed.warnings.length > 0 && (
                  <div className="text-sm mt-2">
                    <span className="font-medium text-yellow-700 dark:text-yellow-400">Warnings:</span>
                    <ul className="list-disc list-inside mt-1 text-yellow-600 dark:text-yellow-500">
                      {response.parsed.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {response.message && (
              <p
                className={`text-sm mb-2 ${
                  response.status === 'success'
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-700 dark:text-red-400'
                }`}
              >
                {response.message}
              </p>
            )}
            {response.error && (
              <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                {response.error}
              </p>
            )}
            {response.httpStatus && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                HTTP Status: {response.httpStatus} {response.httpStatusText}
              </p>
            )}
            {response.rawResponse && (
              <details className="mt-2">
                <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Raw XML Response
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-64">
                  {response.rawResponse}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
