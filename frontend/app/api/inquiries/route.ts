import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const inquiryData = await request.json();

    // Validate required fields
    const { name, email, roomId, roomName, checkIn, checkOut, guests } =
      inquiryData;

    if (
      !name ||
      !email ||
      !roomId ||
      !roomName ||
      !checkIn ||
      !checkOut ||
      !guests
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to customer
    // 4. Add to CRM system

    console.log("New booking inquiry received:", {
      ...inquiryData,
      timestamp: new Date().toISOString(),
      status: "pending",
    });

    // Simulate database save
    const inquiryId = `inq_${Date.now()}`;

    // Simulate email notification
    console.log(`Email notification sent to admin for inquiry ${inquiryId}`);
    console.log(`Confirmation email sent to ${email}`);

    return NextResponse.json({
      success: true,
      inquiryId,
      message: "Inquiry submitted successfully",
      data: {
        ...inquiryData,
        id: inquiryId,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch inquiries from database
    /**
     * API Route for Handling Booking Inquiries
     *
     * This endpoint handles booking inquiries from guest pages,
     * storing them in the database and sending notifications.
     */

    // For demo purposes, return mock data

    const mockInquiries = [
      {
        id: "inq_001",
        name: "John Doe",
        email: "john@example.com",
        phone: "+264 81 123 4567",
        roomId: "room-001",
        roomName: "Standard Room",
        checkIn: "2024-02-15",
        checkOut: "2024-02-17",
        guests: 2,
        message: "Looking for a quiet room with good WiFi",
        status: "pending",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "inq_002",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+264 81 234 5678",
        roomId: "room-002",
        roomName: "Deluxe Room",
        checkIn: "2024-02-20",
        checkOut: "2024-02-22",
        guests: 1,
        message: "Business trip, need early check-in",
        status: "confirmed",
        createdAt: "2024-01-14T14:20:00Z",
      },
    ];

    return NextResponse.json({
      success: true,
      inquiries: mockInquiries,
      total: mockInquiries.length,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}
