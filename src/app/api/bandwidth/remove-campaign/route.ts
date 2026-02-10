import { NextResponse } from 'next/server';
import { removeCampaignFromTns } from '@/lib/bwTnOptions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumbers, sms } = body as {
      phoneNumbers?: string[];
      sms?: 'ON' | 'OFF';
    };

    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'At least one phone number is required',
        },
        { status: 400 }
      );
    }

    const result = await removeCampaignFromTns({
      phoneNumbers,
      sms,
    });

    return NextResponse.json(
      {
        status: result.ok ? 'success' : 'error',
        httpStatus: result.status,
        httpStatusText: result.statusText,
        rawResponse: result.rawResponse,
      },
      { status: result.ok ? 200 : result.status || 500 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Unexpected error while removing campaign from TNs',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

