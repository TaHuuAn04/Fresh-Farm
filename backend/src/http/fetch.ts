/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Readable } from 'stream';

import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';

import {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpFetchDto } from './http-fetch.dto';

export interface IFetchDtoResponse<T> {
  data: T;
  statusCode: number;
  status: boolean;
  message: string;
}

export async function fetchDto<T>(data: {
  dto: HttpFetchDto;
  httpService: HttpService;
  headers?: AxiosRequestHeaders;
}): Promise<IFetchDtoResponse<T>> {
  const { dto, httpService, headers } = data;
  const url = dto.interpolatedUrl;
  console.log('url', url);
  console.log('headers', headers);
  const method = dto.method;
  const responseMessage = 'success';

  try {
    const formData = dto.toFormData();
    const isFormData = !!formData;

    const config: AxiosRequestConfig = {
      url: url,
      method,
      headers: {
        ...headers,
        ...(isFormData
          ? {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/octet-stream',
            }
          : {}),
      },
      data: isFormData ? formData : dto.bodyDto,
    };
    console.log('config', config);

    const response = httpService.request<T>(config);

    const { data, status } = await lastValueFrom<AxiosResponse<T>>(
      response.pipe(),
    );

    return {
      data,
      statusCode: status,
      status: true,
      message: responseMessage,
    };
  } catch (error) {
    let errorMessage = '';

    if (error instanceof AxiosError) {
      errorMessage = JSON.stringify(error.response?.data);
    }

    const errorResponse = {
      data: {},
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      status: false,
      message:
        (errorMessage || error.message) ??
        JSON.stringify(error?.response?.data) ??
        (error || 'Internal server error'),
    } as IFetchDtoResponse<T>;

    let newStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    if (error instanceof AxiosError) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      newStatusCode =
        error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      newStatusCode = HttpStatus.SERVICE_UNAVAILABLE;
    }

    return {
      ...errorResponse,
      statusCode: newStatusCode,
    };
  }
}

export async function fetchStreamDto(data: {
  dto: HttpFetchDto;
  httpService: HttpService;
  headers?: AxiosRequestHeaders;
}): Promise<IFetchDtoResponse<Readable>> {
  const { dto, httpService, headers } = data;
  const url = dto.interpolatedUrl;
  const method = dto.method;
  const responseMessage = 'success';

  try {
    const response = await httpService.axiosRef.request<Readable>({
      url: encodeURI(url),
      data: dto.bodyDto,
      headers,
      method,
      responseType: 'stream',
    });

    return {
      data: response.data,
      statusCode: response.status,
      status: true,
      message: responseMessage,
    };
  } catch (error) {
    const errorResponse = {
      data: {} as Readable,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      status: false,
      message:
        error.message ??
        JSON.stringify(error?.response?.data) ??
        (error || 'Internal server error'),
    } as IFetchDtoResponse<Readable>;

    let newStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    if (error instanceof AxiosError) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      newStatusCode =
        error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (error.request) {
      // The request was made but no response was received
      newStatusCode = HttpStatus.SERVICE_UNAVAILABLE;
    }

    return {
      ...errorResponse,
      statusCode: newStatusCode,
    };
  }
}
