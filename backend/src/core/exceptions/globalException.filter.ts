import { AppError } from "@common/dtos/errorResponse.dto";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
import { Request } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Hệ thống xảy ra lỗi.';
        let errorCode = 'UNKNOWN_ERROR';

        if (exception.constructor.name === 'AppError') {  // Bắt lỗi AppError
            status = exception.statusCode;
            message = exception.message;
            errorCode = exception.errorCode;
        }
        else if (exception instanceof BadRequestException) {  // Bắt lỗi xác thực dữ liệu đầu vào
            status = HttpStatus.BAD_REQUEST;
            const exceptionResponse = exception.getResponse() as any; // Ép kiểu về `any` để xử lý linh hoạt
        
            if (exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
                message = Array.isArray(exceptionResponse.message) 
                    ? exceptionResponse.message 
                    : [exceptionResponse.message];  // Đảm bảo `message` luôn là mảng
            } else {
                message = typeof exceptionResponse === 'string' ? exceptionResponse : 'Dữ liệu không hợp lệ';
            }
        
            errorCode = 'VALIDATION_ERROR';
        }        
        else if (exception instanceof HttpException) {  // Các lỗi HttpException khác
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = exceptionResponse['message'] || exceptionResponse;
        }

        const errorResponse = {
            statusCode: status,
            errorCode: errorCode,
            message: message,
            path: request.url,  
        };

        response.status(status).json(errorResponse);
    }
}
