import { NextResponse } from 'next/server';
import { getPhoneNumbers } from '@/lib/bandwidth';

export async function GET() {
  try {
    const result = await getPhoneNumbers();
    
    if (result.success) {
      return NextResponse.json({
        status: 'success',
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to fetch phone numbers',
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
