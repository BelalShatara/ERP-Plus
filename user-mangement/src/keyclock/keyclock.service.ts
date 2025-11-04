import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { keycloakConfig } from 'src/config/keyclock.config';
import { KeyclockAction } from './interface/keyclock.action';
import { User } from 'src/user/interface/user.interface';
import { AxiosError } from 'axios';


@Injectable()
export class KeyclockService implements KeyclockAction {
    constructor(private readonly httpService: HttpService) {}



    private buildTokenParams(grantType: string, additionalParams?: Record<string, string>): URLSearchParams {
        const params = new URLSearchParams();
        params.append('grant_type', grantType);
        params.append('client_id', keycloakConfig.clientId);
        params.append('client_secret', keycloakConfig.secret);
        
        if (additionalParams) {
            Object.entries(additionalParams).forEach(([key, value]) => {
                params.append(key, value);
            });
        }
        
        return params;
    }

    private requestToken(tokenUrl: string, params: URLSearchParams): Observable<any> {
        return this.httpService.post<{access_token: string}>(tokenUrl, params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
    }

    getAdminToken(): Observable<string> {
        const tokenUrl =
          `${keycloakConfig.authServerUrl}/realms/${keycloakConfig.realm}` +
          `/protocol/openid-connect/token`;
    
        const params = this.buildTokenParams('client_credentials');
        return this.requestToken(tokenUrl, params);
    }

    login(email: string, password: string): Observable<any> {
        const tokenUrl = keycloakConfig.tokenEndpoint;
        const params = this.buildTokenParams('password', {
            username: email,
            password: password,
        });
        
        return this.requestToken(tokenUrl, params).pipe(
            catchError((error: AxiosError) => {

                if (error.response) {
                    const status = error.response.status;
                    const errorData = error.response.data;
                    
                    switch (status) {
                        case 401:
                            return throwError(() => new HttpException(
                                'Invalid email or password. Please check your credentials and try again.',
                                HttpStatus.UNAUTHORIZED
                            ));
                        case 400:
                            return throwError(() => new HttpException(
                                'Invalid request. Please check your login details.',
                                HttpStatus.BAD_REQUEST
                            ));
                        case 403:
                            return throwError(() => new HttpException(
                                'Access denied. You do not have permission to login.',
                                HttpStatus.FORBIDDEN
                            ));
                        case 404:
                            return throwError(() => new HttpException(
                                'Authentication service not found. Please contact support.',
                                HttpStatus.NOT_FOUND
                            ));
                        case 500:
                        case 502:
                        case 503:
                            return throwError(() => new HttpException(
                                'Authentication service is temporarily unavailable. Please try again later.',
                                HttpStatus.SERVICE_UNAVAILABLE
                            ));
                        default:
                            return throwError(() => new HttpException(
                                errorData || 'Login failed. Please try again.',
                                status || HttpStatus.INTERNAL_SERVER_ERROR
                            ));
                    }
                } else {
                    // Network error or no response
                    return throwError(() => new HttpException(
                        'Unable to connect to authentication service. Please check your network connection.',
                        HttpStatus.SERVICE_UNAVAILABLE
                    ));
                }
            })
        );
    }


    createUser(user: User): Observable<string> {
        throw new Error('Method not implemented.');
    }
    updateUser(user: User): Observable<string> {
        throw new Error('Method not implemented.');
    }
    deleteUser(user: User): Observable<string> {
        throw new Error('Method not implemented.');
    }



}
