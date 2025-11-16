import mongoose, { Schema, models } from 'mongoose';

export type PortfolioCategory =
  | 'wedding'
  | 'pre-wedding'
  | 'events'
  | 'portraits'
  | 'cinematic'
  | 'corporate'
  | 'maternity'
  | 'baby';

export interface IPortfolioImage {
  _id: string;
  url: string;
  publicId: string;
  category: PortfolioCategory;
  isLandingPage: boolean;
  order: number;
  uploadedAt: Date;
}

const PortfolioImageSchema = new Schema<IPortfolioImage>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['wedding', 'pre-wedding', 'events', 'portraits', 'cinematic', 'corporate', 'maternity', 'baby'],
    },
    isLandingPage: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
PortfolioImageSchema.index({ category: 1, order: 1 });
PortfolioImageSchema.index({ isLandingPage: 1 });

const PortfolioImage = models.PortfolioImage || mongoose.model<IPortfolioImage>('PortfolioImage', PortfolioImageSchema);

export default PortfolioImage;
