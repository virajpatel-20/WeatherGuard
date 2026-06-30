import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WeatherAlertData } from '../telegram/telegram.service';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private readonly configService: ConfigService) {}

  async getWeather(location: string): Promise<WeatherAlertData | null> {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENWEATHER_API_KEY not set — returning mock data');
      return this.getMockWeather(location);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: location,
          appid: apiKey,
          units: 'metric',
        },
      });

      const data = response.data;
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        description: data.weather[0].description,
      };
    } catch (err) {
      this.logger.error(`Failed to fetch weather for ${location}:`, err);
      return this.getMockWeather(location);
    }
  }

  private getMockWeather(location: string): WeatherAlertData {
    const conditions = [
      { description: 'clear sky', temp: 28 },
      { description: 'partly cloudy', temp: 22 },
      { description: 'light rain', temp: 18 },
      { description: 'thunderstorm with rain', temp: 15 },
    ];
    const pick = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      location: location || 'Unknown City',
      temperature: pick.temp,
      feelsLike: pick.temp - 2,
      humidity: 65,
      windSpeed: 15,
      description: pick.description,
    };
  }
}
