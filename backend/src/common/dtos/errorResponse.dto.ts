export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;

    constructor(statusCode: number, message: string, errorCode: string) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    
        Object.setPrototypeOf(this, new.target.prototype);
    }
}