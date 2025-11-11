import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { AxiosError } from "axios";

export class HttpErrorHandler {
    static handle(axiosError: AxiosError): HttpException {
        console.log("axiosError", axiosError);

        if (axiosError.response) {
            console.log("response", axiosError.response);
            console.log("status", axiosError.response.status);

            switch (axiosError.response.status) {
                case 401:
                    return new HttpException(
                        'Invalid email or password. Please check your credentials and try again.',
                        HttpStatus.UNAUTHORIZED
                    );
                case 400:
                    return new HttpException(
                        'Invalid request. Please check your login details.',
                        HttpStatus.BAD_REQUEST
                    );
                case 403:
                    return new HttpException(
                        'Access denied. You do not have permission to login.',
                        HttpStatus.FORBIDDEN
                    );
                case 404:
                    return new HttpException(
                        'Authentication service not found. Please contact support.',
                        HttpStatus.NOT_FOUND
                    );
                case 409:
                    return new HttpException(
                        'User already exists with this username or email.',
                        HttpStatus.CONFLICT
                    );
                case 500:
                case 502:
                case 503:
                    return new HttpException(
                        'Authentication service is temporarily unavailable. Please try again later.',
                        HttpStatus.SERVICE_UNAVAILABLE
                    );
                default:
                    return new HttpException(
                        'An unexpected error occurred. Please try again later.',
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
            }
        } else {
            // Handle network errors or other issues without response
            console.log("No response from server", axiosError.message);
            return new HttpException(
                'Unable to connect to authentication service. Please try again later.',
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }
}