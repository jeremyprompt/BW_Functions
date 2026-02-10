import { NextResponse } from 'next/server';
import { transferTns } from '@/lib/bwTnOptions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subAccountId, locationId, phoneNumbers } = body as {
      subAccountId?: number;
      locationId?: number;
      phoneNumbers?: string[];
    };

    if (!subAccountId || !locationId || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'subAccountId, locationId, and at least one phone number are required',
        },
        { status: 400 }
      );
    }

    const result = await transferTns({
      subAccountId,
      locationId,
      phoneNumbers,
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
        message: 'Unexpected error while transferring TNs',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

