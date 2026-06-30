import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot | null = null;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not set — Telegram bot disabled');
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.registerHandlers();
    this.logger.log('Telegram bot started');
  }

  private registerHandlers() {
    if (!this.bot) return;
    this.bot.on('message', (msg) => {
    console.log('Telegram message received:', msg.text);
    console.log('Chat ID:', msg.chat.id);
    });

    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id.toString();
      const username = msg.from?.username;

      await this.bot!.sendMessage(
        chatId,
        `🌤️ *Welcome to WeatherGuard Bot!*\n\nI'll send you weather alerts once your account is approved.\n\nYour Chat ID is: \`${chatId}\`\n\nPlease copy this ID and add it to your WeatherGuard profile at the web app.`,
        { parse_mode: 'Markdown' },
      );
    });

    this.bot.onText(/\/status/, async (msg) => {
      const chatId = msg.chat.id.toString();
      const users = await this.usersService.findAll();
      const user = users.find((u) => u.telegramChatId === chatId);

      if (!user) {
        await this.bot!.sendMessage(chatId, '❓ Your Telegram account is not linked to any WeatherGuard account yet. Please sign in at the web app and add your Chat ID.');
        return;
      }

      const statusEmoji = { pending: '⏳', approved: '✅', rejected: '❌' }[user.status] ?? '❓';
      await this.bot!.sendMessage(
        chatId,
        `${statusEmoji} *Account Status*\n\nName: ${user.name}\nStatus: ${user.status.toUpperCase()}`,
        { parse_mode: 'Markdown' },
      );
    });
  }

  async sendApprovalNotification(chatId: string, userName: string): Promise<void> {
    if (!this.bot) return;
    try {
      await this.bot.sendMessage(
        chatId,
        `🎉 *Welcome to WeatherGuard, ${userName}!*\n\nYour access request has been *approved*. You'll now receive automated weather alerts.\n\nType /status anytime to check your account.`,
        { parse_mode: 'Markdown' },
      );
    } catch (err) {
      this.logger.error(`Failed to send approval notification to ${chatId}:`, err);
    }
  }

  async sendWeatherAlert(chatId: string, alertData: WeatherAlertData): Promise<void> {
    if (!this.bot) return;
    try {
      const message = this.formatWeatherAlert(alertData);
      await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (err) {
      this.logger.error(`Failed to send weather alert to ${chatId}:`, err);
    }
  }

  private formatWeatherAlert(data: WeatherAlertData): string {
    const weatherEmoji: Record<string, string> = {
      clear: '☀️',
      clouds: '☁️',
      rain: '🌧️',
      drizzle: '🌦️',
      thunderstorm: '⛈️',
      snow: '❄️',
      mist: '🌫️',
      fog: '🌫️',
    };

    const condition = data.description.split(' ')[0].toLowerCase();
    const emoji = weatherEmoji[condition] ?? '🌡️';

    return [
      `${emoji} *Weather Alert — ${data.location}*`,
      ``,
      `🌡️ Temperature: *${data.temperature}°C* (feels like ${data.feelsLike}°C)`,
      `💧 Humidity: ${data.humidity}%`,
      `💨 Wind: ${data.windSpeed} km/h`,
      `📋 Conditions: ${data.description}`,
      ``,
      `_Updated: ${new Date().toLocaleString()}_`,
    ].join('\n');
  }
}

export interface WeatherAlertData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
}
