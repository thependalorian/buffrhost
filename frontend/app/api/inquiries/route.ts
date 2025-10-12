import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const inquiry = {
      id: Date.now().toString(),
      name,
      email,
      message,
      status: 'received',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Inquiries API is running',
    status: 'healthy'
  });
}