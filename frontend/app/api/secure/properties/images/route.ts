/**
 * Property Images Management API Route
 *
 * Handles image upload, management, and organization for properties
 * Features: Upload, categorize, sort, delete images
 * Location: app/api/secure/properties/images/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// GET - Fetch Property Images
// =============================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _propertyId = searchParams.get('property_id');
    const imageType = searchParams.get('image_type');
    const _roomId = searchParams.get('room_id');

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID is required',
        },
        { status: 400 }
      );
    }

    // Get images
    const images = await DatabaseService.getPropertyImages(propertyId, {
      imageType,
      roomId,
    });

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error('Property Images API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Upload Property Images
// =============================================================================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const _propertyId = formData.get('property_id') as string;
    const _roomId = formData.get('room_id') as string;
    const imageType = formData.get('image_type') as string;
    const _altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const _isPrimary = formData.get('is_primary') === 'true';
    const files = formData.getAll('files') as File[];

    if (!propertyId || !imageType || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID, image type, and files are required',
        },
        { status: 400 }
      );
    }

    // Upload images
    const uploadedImages = await DatabaseService.uploadPropertyImages(
      propertyId,
      files.map((file, index) => ({
        url: `/uploads/properties/${propertyId}/${file.name}`, // This would be the actual uploaded URL
        caption: caption || `Image ${index + 1}`,
        category: imageType,
        sortOrder: index,
      }))
    );

    return NextResponse.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
    });
  } catch (error) {
    console.error('Image Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update Image Details
// =============================================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, alt_text, caption, sort_order, is_primary } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image ID is required',
        },
        { status: 400 }
      );
    }

    // Update image
    const updatedImage = await DatabaseService.updatePropertyImage(id, {
      alt_text,
      caption,
      sort_order,
      is_primary,
    });

    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: 'Image updated successfully',
    });
  } catch (error) {
    console.error('Image Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete Image
// =============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image ID is required',
        },
        { status: 400 }
      );
    }

    // Delete image
    await DatabaseService.deletePropertyImage(id);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Image Deletion Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
