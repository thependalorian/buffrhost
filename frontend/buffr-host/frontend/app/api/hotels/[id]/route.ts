/**
 * Hotel Detail API Endpoint
 *
 * Returns detailed information about a specific hotel
 * Location: app/api/hotels/[id]/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock hotel data - will be replaced with actual database queries
const mockHotels = [
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Namib Desert Lodge',
    type: 'hotel',
    location: 'Sossusvlei',
    ownerId: 'owner-006',
    tenantId: 'default-tenant',
    status: 'active',
    description:
      'Luxury desert lodge with stunning views of the Namib Desert and Sossusvlei dunes.',
    address: 'Desert Road, Sossusvlei, Namibia',
    phone: '+264 63 123 456',
    email: 'info@namibdesertlodge.com',
    website: 'www.namibdesertlodge.com',
    rating: 4.9,
    totalOrders: 234,
    totalRevenue: 125000.0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    images: [
      {
        id: 'img-006',
        propertyId: '550e8400-e29b-41d4-a716-446655440006',
        imageUrl: '/images/hotels/namib-desert-main.jpg',
        imageType: 'main',
        altText: 'Namib Desert Lodge exterior',
        sortOrder: 1,
        isActive: true,
        createdAt: new Date('2024-01-15'),
      },
    ],
    features: [
      {
        id: 'feat-006',
        propertyId: '550e8400-e29b-41d4-a716-446655440006',
        featureName: 'Desert Views',
        featureType: 'amenity',
        description: 'Panoramic desert and dune views',
        isActive: true,
        createdAt: new Date('2024-01-15'),
      },
    ],
    reviews: [
      {
        id: 'rev-006',
        propertyId: '550e8400-e29b-41d4-a716-446655440006',
        customerId: 'customer-004',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah@email.com',
        rating: 5.0,
        reviewText:
          'Absolutely stunning location and luxury accommodation. The desert views are breathtaking!',
        serviceRating: 5.0,
        cleanlinessRating: 5.0,
        valueRating: 4.8,
        locationRating: 5.0,
        amenitiesRating: 5.0,
        isVerified: true,
        isPublic: true,
        createdAt: new Date('2024-01-20'),
      },
    ],
    hotelDetails: {
      id: 'hotel-006',
      propertyId: '550e8400-e29b-41d4-a716-446655440006',
      starRating: 5,
      checkInTime: '15:00',
      checkOutTime: '11:00',
      totalRooms: 25,
      availableRooms: 18,
      roomTypes: [
        { type: 'Desert View Suite', count: 10, price: 450 },
        { type: 'Standard Room', count: 15, price: 320 },
      ],
      amenities: ['wifi', 'pool', 'spa', 'restaurant', 'bar', 'safari_tours'],
      policies: {
        cancellation: '48h',
        pets: 'not_allowed',
        smoking: 'prohibited',
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotelId = params.id;

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    // Find hotel in mock data
    const hotel = mockHotels.find((h) => h.id === hotelId);

    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    // Return hotel with all related data
    return NextResponse.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error('Hotel Detail API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
