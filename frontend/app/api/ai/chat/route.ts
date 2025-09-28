import { NextRequest, NextResponse } from "next/server";

// Rate limiting (simple in-memory store for demo)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.ip || "unknown";
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30;

    if (!rateLimit.has(clientId)) {
      rateLimit.set(clientId, { count: 1, resetTime: now + windowMs });
    } else {
      const rateLimitInfo = rateLimit.get(clientId)!;

      if (now > rateLimitInfo.resetTime) {
        rateLimitInfo.count = 1;
        rateLimitInfo.resetTime = now + windowMs;
      } else if (rateLimitInfo.count >= maxRequests) {
        return NextResponse.json(
          {
            error: "Too many requests. Please try again later.",
            retryAfter: Math.ceil((rateLimitInfo.resetTime - now) / 1000),
          },
          { status: 429 },
        );
      } else {
        rateLimitInfo.count++;
      }
    }

    // Parse request body
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 },
      );
    }

    // Validate message length
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message too long. Maximum 1000 characters allowed." },
        { status: 400 },
      );
    }

    // Use DeepSeek API directly
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are the AI concierge for Etuna Guesthouse & Tours in Ongwediva, Namibia. 

PROPERTY INFORMATION:
- 35 rooms total (15 Standard, 10 Executive, 6 Luxury, 3 Family, 1 Premier)
- Restaurant with traditional Namibian cuisine
- Conference facilities available
- Tours: Etosha National Park, Ruacana Falls, Cultural experiences
- Contact: +264 65 231 177, bookings@etunaguesthouse.com

SAFETY CONSTRAINTS:
- Do NOT make actual bookings - direct to +264 65 231 177
- Do NOT handle payments
- Do NOT provide medical advice
- Escalate emergencies to +264 65 231 177

Be helpful, professional, and culturally sensitive. Always encourage direct contact for bookings.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse =
      data.choices[0]?.message?.content ||
      "I apologize, but I cannot process your request at the moment. Please contact our reception at +264 65 231 177.";

    // Simple intent classification
    const lowerMessage = message.toLowerCase();
    let conversationType = "information";
    let priority = "low";

    if (
      ["emergency", "urgent", "help", "medical", "fire", "accident"].some(
        (word) => lowerMessage.includes(word),
      )
    ) {
      conversationType = "emergency";
      priority = "urgent";
    } else if (
      ["book", "reservation", "room", "stay"].some((word) =>
        lowerMessage.includes(word),
      )
    ) {
      conversationType = "booking";
      priority = "medium";
    } else if (
      ["complaint", "problem", "issue"].some((word) =>
        lowerMessage.includes(word),
      )
    ) {
      conversationType = "complaint";
      priority = "high";
    }

    const result = {
      response: aiResponse,
      conversationType,
      priority,
      requiresHandoff:
        priority === "urgent" || conversationType === "emergency",
      turnCount: 1,
      sessionId: sessionId || `session_${new Date().toISOString()}`,
      safetyNotice:
        priority === "urgent"
          ? "Please contact reception immediately at +264 65 231 177"
          : undefined,
    };

    // Return response
    return NextResponse.json({
      response: result.response,
      metadata: {
        conversationType: result.conversationType,
        priority: result.priority,
        requiresHandoff: result.requiresHandoff,
        turnCount: result.turnCount,
      },
      sessionId: result.sessionId,
      timestamp: new Date().toISOString(),
      safetyNotice: result.safetyNotice,
    });
  } catch (error) {
    console.error("AI Chat API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Please contact reception at +264 65 231 177",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "Etuna AI Agent",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}

/**
 * AI Chat API Route
 *
 * Handles AI agent requests for the Etuna Guesthouse AI Assistant
 * Uses the LangGraph-based EtunaAgent for processing messages
 */
