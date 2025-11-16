import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import PortfolioImage from '@/models/Portfolio';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

// GET - Fetch all portfolio images or by category
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const landingOnly = searchParams.get('landingOnly');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (landingOnly === 'true') {
      query.isLandingPage = true;
    }

    const images = await PortfolioImage.find(query).sort({ order: 1, uploadedAt: -1 });

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching portfolio images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST - Upload new image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const isLandingPage = formData.get('isLandingPage') === 'true';

    if (!file || !category) {
      return NextResponse.json(
        { success: false, error: 'File and category are required' },
        { status: 400 }
      );
    }

    // Check if category already has 20 images
    const count = await PortfolioImage.countDocuments({ category });
    if (count >= 20) {
      return NextResponse.json(
        { success: false, error: 'Maximum 20 images allowed per category' },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(base64, `lvclicks/${category}`);

    // If isLandingPage is true, unset other landing page images for this category
    if (isLandingPage) {
      await PortfolioImage.updateMany({ category }, { isLandingPage: false });
    }

    // Get the next order number
    const maxOrder = await PortfolioImage.findOne({ category }).sort({ order: -1 });
    const order = maxOrder ? maxOrder.order + 1 : 0;

    // Create database entry
    const portfolioImage = await PortfolioImage.create({
      url,
      publicId,
      category,
      isLandingPage,
      order,
    });

    return NextResponse.json({ success: true, data: portfolioImage }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete image
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Image ID required' }, { status: 400 });
    }

    const image = await PortfolioImage.findById(id);

    if (!image) {
      return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(image.publicId);

    // Delete from database
    await PortfolioImage.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// PATCH - Update image (toggle landing page or reorder)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { id, isLandingPage, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Image ID required' }, { status: 400 });
    }

    const image = await PortfolioImage.findById(id);

    if (!image) {
      return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
    }

    // If setting as landing page, unset others in the same category
    if (isLandingPage !== undefined && isLandingPage === true) {
      await PortfolioImage.updateMany({ category: image.category }, { isLandingPage: false });
    }

    // Update the image
    const updateData: any = {};
    if (isLandingPage !== undefined) updateData.isLandingPage = isLandingPage;
    if (order !== undefined) updateData.order = order;

    const updatedImage = await PortfolioImage.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ success: true, data: updatedImage });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}
