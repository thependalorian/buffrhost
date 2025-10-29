import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    sendgridConfigured: !!process.env['SENDGRID_API_KEY'],
    databaseConfigured: !!process.env['DATABASE_URL'],
    fromEmail: process.env['FROM_EMAIL'],
    sendgridKeyLength: process.env['SENDGRID_API_KEY']?.length || 0,
    nodeEnv: process.env['NODE_ENV'],
    allEnvKeys: Object.keys(process.env).filter(
      (key) =>
        key.includes('SENDGRID') ||
        key.includes('DATABASE') ||
        key.includes('EMAIL')
    ),
  });
}
