import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestId } = body;
    
    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    const recommendations = {
      guestId,
      recommendations: [
        {
          id: '1',
          type: 'room',
          title: 'Deluxe Suite',
          description: 'Spacious suite with ocean view',
          price: 500,
        },
      ],
    };

    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Recommendations API is running',
    status: 'healthy'
  });
}