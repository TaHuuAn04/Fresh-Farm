/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Method } from 'axios';

export abstract class HttpFetchDto {
  abstract method: Method;
  abstract url: string;
  abstract paramsDto: any;
  abstract queryDto: any;
  abstract bodyDto: any;
  abstract responseDto: any;
  headers?: any;

  get interpolatedUrl() {
    return this.appendQueryParams(this.interpolatePathParams(this.url));
  }

  private interpolatePathParams(url: string) {
    if (!this.paramsDto) {
      return url;
    }

    return Object.entries(this.paramsDto).reduce(
      (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
      url,
    );
  }

  private appendQueryParams(url: string) {
    if (!this.queryDto) {
      return url;
    }

    const queryString = this.buildQueryString();
    if (!queryString) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${queryString}`;
  }

  private buildQueryString() {
    return Object.entries(this.queryDto)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join('&');
  }

  // Default implementation of toFormData
  public toFormData(): FormData | undefined {
    return undefined;
  }
}
