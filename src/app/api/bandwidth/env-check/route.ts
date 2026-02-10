import { NextResponse } from 'next/server';

export async function GET() {
  // Do NOT return actual secrets, only whether they are defined.
  const vars = {
    BANDWIDTH_USERNAME: !!process.env.BANDWIDTH_USERNAME,
    BANDWIDTH_PASSWORD: !!process.env.BANDWIDTH_PASSWORD,
    BANDWIDTH_ACCOUNT_ID: !!process.env.BANDWIDTH_ACCOUNT_ID,
    BANDWIDTH_APPLICATION_ID: !!process.env.BANDWIDTH_APPLICATION_ID,
  };

  return NextResponse.json({
    status: 'ok',
    envPresent: vars,
  });
}

