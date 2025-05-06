// src/services/adafruit.service.ts
import { AppError } from '@common/dtos/errorResponse.dto';
import { ADAFRUIT_KEY, ADAFRUIT_USERNAME } from '@environments';
import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AdafruitService {
  private readonly adafruitUsername: string;
  private readonly adafruitKey: string;

  constructor() {
    this.adafruitUsername = ADAFRUIT_USERNAME;
    this.adafruitKey = ADAFRUIT_KEY;
  }

  async createFeed(
    name: string,
    key: string,
    description: string,
  ): Promise<any> {
    try {
      const response = await axios.post(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds`,
        { name, key, description, last_value: 0 },
        {
          headers: {
            'X-AIO-Key': this.adafruitKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'Failed to create feed on Adafruit:',
        error.response?.data || error.message,
      );
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create device on Adafruit IO',
        'CREATE_FEED_FAILED',
      );
    }
  }

  async getFeed(key: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds/${key}`,
        { headers: { 'X-AIO-Key': this.adafruitKey } },
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch feed ${key} from Adafruit:`,
        error.response?.data || error.message,
      );
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to get device on Adafruit IO',
        'GET_FEED_FAILED',
      );
    }
  }

  async updateFeed(
    key: string,
    name: string,
    description: string,
  ): Promise<void> {
    try {
      await axios.patch(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds/${key}`,
        { name, description },
        {
          headers: {
            'X-AIO-Key': this.adafruitKey,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(
        `Failed to update feed ${key} on Adafruit:`,
        error.response?.data || error.message,
      );
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update device on Adafruit IO',
        'UPDATE_FEED_FAILED',
      );
    }
  }

  async deleteFeed(key: string): Promise<void> {
    try {
      await axios.delete(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds/${key}`,
        { headers: { 'X-AIO-Key': this.adafruitKey } },
      );
    } catch (error) {
      console.error(
        `Failed to delete feed ${key} on Adafruit:`,
        error.response?.data || error.message,
      );
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to delete device on Adafruit IO',
        'DELETE_FEED_FAILED',
      );
    }
  }

  async toggleFeedStatus(key: string, value: string): Promise<void> {
    try {
      await axios.post(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds/${key}/data`,
        { value },
        {
          headers: {
            'X-AIO-Key': this.adafruitKey,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(
        `Failed to toggle feed status ${key} on Adafruit:`,
        error.response?.data || error.message,
      );
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to toggle device on Adafruit IO',
        'TOGGLE_FEED_FAILED',
      );
    }
  }
}
