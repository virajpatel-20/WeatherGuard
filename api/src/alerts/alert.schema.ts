import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlertDocument = Alert & Document;

export enum AlertStatus {
  SENT = 'sent',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Schema({ timestamps: true })
export class Alert {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  windSpeed: number;

  @Prop({ enum: AlertStatus, default: AlertStatus.PENDING })
  status: AlertStatus;

  @Prop()
  errorMessage?: string;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
