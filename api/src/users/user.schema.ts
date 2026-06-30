import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum AuthProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
}


@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name !: string;

  @Prop({ required: true, unique: true })
  email !: string;

  @Prop()
  avatar?: string;

  @Prop({ required: true, enum: AuthProvider })
  provider !: AuthProvider;

  @Prop({ required: true })
  providerId !: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role !: UserRole;

  @Prop({ enum: UserStatus, default: UserStatus.PENDING })
  status !: UserStatus;

  @Prop()
  telegramChatId?: string;

  @Prop()
  telegramUsername?: string;

  @Prop()
  location?: string;

  @Prop()
  approvedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  rejectedAt?: Date;

  @Prop()
  requestMessage?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
