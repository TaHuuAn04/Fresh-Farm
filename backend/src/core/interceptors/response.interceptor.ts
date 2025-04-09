import { ApiResponse } from "@common/dtos/apiResponse.dto";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map } from "rxjs";

@Injectable()
export class GlobalResponseInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(
            map(data => new ApiResponse(200, 'Thành công', data)),
        )
    }
}