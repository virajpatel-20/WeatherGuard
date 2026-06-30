import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getRecentAlerts() {
    const alerts = await this.alertsService.findRecentAlerts();
    return { alerts };
  }

  // Public endpoint for testing/demo
  @Post('trigger')
  async triggerManual() {
    const result = await this.alertsService.triggerManualAlert();
    return {
      message: 'Weather alerts dispatched',
      ...result,
    };
  }
}