import { NextResponse } from 'next/server';
import { checkApiStatus } from '@/lib/bandwidth';

export async function GET() {
  try {
    const result = await checkApiStatus();
    
    if (result.success) {
      return NextResponse.json({
        status: 'connected',
        message: 'Successfully connected to Bandwidth API',
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to connect to Bandwidth API',
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
