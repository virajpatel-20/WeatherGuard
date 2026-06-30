import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Alert, AlertDocument, AlertStatus } from './alert.schema';
import { UsersService } from '../users/users.service';
import { WeatherService } from '../weather/weather.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
    private readonly usersService: UsersService,
    private readonly weatherService: WeatherService,
    private readonly telegramService: TelegramService,
  ) {}

  // Runs every 6 hours
  @Cron('0 */6 * * *')
  async sendScheduledAlerts() {
    this.logger.log('Running scheduled weather alert job...');
    await this.dispatchAlertsToApprovedUsers();
  }

  async dispatchAlertsToApprovedUsers(): Promise<{ sent: number; failed: number }> {
    const approvedUsers = await this.usersService.findApprovedUsers();
    let sent = 0;
    let failed = 0;

    for (const user of approvedUsers) {
      if (!user.telegramChatId) continue;

      const location = user.location || 'London,UK';

      try {
        const weather = await this.weatherService.getWeather(location);
        if (!weather) continue;

        await this.telegramService.sendWeatherAlert(user.telegramChatId, weather);

        await this.alertModel.create({
          userId: user._id,
          location: weather.location,
          temperature: weather.temperature,
          description: weather.description,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          status: AlertStatus.SENT,
        });

        sent++;
      } catch (err) {
        failed++;
        await this.alertModel.create({
          userId: user._id,
          location,
          temperature: 0,
          description: 'N/A',
          humidity: 0,
          windSpeed: 0,
          status: AlertStatus.FAILED,
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
        });
        this.logger.error(`Failed alert for user ${user._id}:`, err);
      }
    }

    this.logger.log(`Alerts dispatched: ${sent} sent, ${failed} failed`);
    return { sent, failed };
  }

  async findRecentAlerts(limit = 50): Promise<AlertDocument[]> {
    return this.alertModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email');
  }

  async triggerManualAlert(): Promise<{ sent: number; failed: number }> {
    return this.dispatchAlertsToApprovedUsers();
  }
}
