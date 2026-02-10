import { NextResponse } from 'next/server';
import { sendMessage } from '@/lib/bandwidth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, from, text } = body;

    if (!to || !from || !text) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing required fields: to, from, and text are required',
        },
        { status: 400 }
      );
    }

    const result = await sendMessage(to, from, text);
    
    if (result.success) {
      return NextResponse.json({
        status: 'success',
        message: 'Message sent successfully',
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to send message',
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
