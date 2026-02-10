import { NextResponse } from 'next/server';
import { addCampaignToTns } from '@/lib/bwTnOptions';
import { parseTnOptionOrderResponse } from '@/lib/xmlParser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaignId, phoneNumbers, sms, customerOrderId } = body as {
      campaignId?: string;
      phoneNumbers?: string[];
      sms?: 'ON' | 'OFF';
      customerOrderId?: string;
    };

    if (!campaignId || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'campaignId and at least one phone number are required',
        },
        { status: 400 }
      );
    }

    const result = await addCampaignToTns({
      campaignId,
      phoneNumbers,
      sms,
      customerOrderId,
    });

    // Parse XML response if available
    let parsedResponse = null;
    if (result.rawResponse && result.ok) {
      parsedResponse = parseTnOptionOrderResponse(result.rawResponse);
    }

    return NextResponse.json(
      {
        status: result.ok ? 'success' : 'error',
        httpStatus: result.status,
        httpStatusText: result.statusText,
        rawResponse: result.rawResponse,
        parsed: parsedResponse,
      },
      { status: result.ok ? 200 : result.status || 500 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Unexpected error while adding campaign to TNs',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

