import { Controller, Get, Put, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../telegram/telegram.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return { users };
  }

  @Get('pending')
  async getPendingRequests() {
    const users = await this.usersService.findPendingRequests();
    return { users };
  }

  @Put('users/:id/approve')
  async approveUser(@Param('id') id: string, @Request() req: any) {
    const user = await this.usersService.approveUser(id, req.user.userId);

    // Notify via Telegram if chat ID is set
    if (user.telegramChatId) {
      await this.telegramService.sendApprovalNotification(user.telegramChatId, user.name);
    }

    return { user, message: 'User approved successfully' };
  }

  @Put('users/:id/reject')
  async rejectUser(@Param('id') id: string) {
    const user = await this.usersService.rejectUser(id);
    return { user, message: 'User rejected' };
  }

  @Get('stats')
  async getStats() {
    const [all, pending] = await Promise.all([
      this.usersService.findAll(),
      this.usersService.findPendingRequests(),
    ]);
    const approved = all.filter((u) => u.status === 'approved');
    const rejected = all.filter((u) => u.status === 'rejected');
    return {
      stats: {
        total: all.length,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
      },
    };
  }
}
