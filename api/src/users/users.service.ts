import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserStatus, AuthProvider, UserRole } from './user.schema';

export interface CreateUserDto {
  name: string;
  email: string;
  avatar?: string;
  provider: AuthProvider;
  providerId: string;
  requestMessage?: string;
}

export interface UpdateProfileDto {
  location?: string;
  telegramChatId?: string;
  telegramUsername?: string;
  requestMessage?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

async findOrCreate(data: any) {
    let user = await this.userModel.findOne({ email: data.email });

    if (!user) {

        const totalUsers = await this.userModel.countDocuments();

        user = await this.userModel.create({
            ...data,

            role: totalUsers === 0
                ? UserRole.ADMIN
                : UserRole.USER,

            status: totalUsers === 0
                ? UserStatus.APPROVED
                : UserStatus.PENDING,
        });
    }

    return user;
}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findApprovedUsers(): Promise<UserDocument[]> {
    return this.userModel.find({
      status: UserStatus.APPROVED,
      telegramChatId: { $exists: true, $ne: null },
    });
  }

  async findPendingRequests(): Promise<UserDocument[]> {
    return this.userModel.find({ status: UserStatus.PENDING }).sort({ createdAt: -1 });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ createdAt: -1 });
  }

  async approveUser(userId: string, adminId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        status: UserStatus.APPROVED,
        approvedAt: new Date(),
        approvedBy: new Types.ObjectId(adminId),
      },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async rejectUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { status: UserStatus.REJECTED, rejectedAt: new Date() },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(userId, dto, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}