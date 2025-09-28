import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, itemId, itemType, action, timestamp } = body;

    // Validate required fields
    if (!userId || !itemId || !itemType || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Log the recommendation data (in production, this would go to a database)
    console.log("Recommendation data received:", {
      userId,
      itemId,
      itemType,
      action,
      timestamp: timestamp || new Date().toISOString(),
    });

    // In a real implementation, this would:
    // 1. Store the data in a database
    // 2. Send to AI/ML service for processing
    // 3. Update user preference models
    // 4. Generate personalized recommendations

    // For now, we'll simulate successful processing
    const recommendationData = {
      userId,
      itemId,
      itemType,
      action,
      timestamp: timestamp || new Date().toISOString(),
      processed: true,
      recommendationScore: action === "like" ? 1 : -1,
    };

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      message: "Recommendation data processed successfully",
      data: recommendationData,
    });
  } catch (error) {
    console.error("Error processing recommendation data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // In a real implementation, this would fetch personalized recommendations
    // from the AI/ML service based on user preferences and behavior
    /**
     * Recommendations API Endpoint
     *
     * Handles user interaction data for AI/ML recommendation engine
     * Collects likes, dislikes, and user preferences for personalized recommendations
     */

    const mockRecommendations = {
      userId,
      recommendations: [
        {
          itemId: "room-001",
          itemType: "room",
          score: 0.95,
          reason: "Based on your preferences for luxury accommodations",
        },
        {
          itemId: "tour-002",
          itemType: "tour",
          score: 0.87,
          reason: "Similar to tours you've liked before",
        },
        {
          itemId: "service-001",
          itemType: "service",
          score: 0.82,
          reason: "Popular among users with similar preferences",
        },
      ],
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockRecommendations,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
