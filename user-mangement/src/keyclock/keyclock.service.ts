import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { keycloakConfig } from 'src/config/keyclock.config';
import { KeyclockAction } from './interface/keyclock.action';
import { User } from 'src/user/interface/user.interface';
import { AxiosError } from 'axios';
import { UserKeyclock } from './adapter/user';
// import { SingupAdapter } from './adapter/auth.adapter';
import { SignupDto } from 'src/auth/auth.dto';
import { HttpErrorHandler } from './filter/http-error-handler';


@Injectable()
export class KeyclockService implements KeyclockAction {
        

    
    constructor(private readonly httpService: HttpService) {
    }


    // private buildTokenParams(additionalParams?: Record<string, string>): URLSearchParams {
    //     const params = new URLSearchParams();
    //     params.append('client_id', keycloakConfig.clientId);
    //     params.append('client_secret', keycloakConfig.secret);
        
    //     if (additionalParams) {
    //         Object.entries(additionalParams).forEach(([key, value]) => {
    //             params.append(key, value);
    //         });
    //     }
        
    //     return params;
    // }

    private setGrantType(grantType: string): URLSearchParams {
        return new URLSearchParams({
            'client_id': keycloakConfig.clientId,
            'client_secret': keycloakConfig.secret,
            'grant_type': grantType,
        });
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
    
        const serviceParams = new URLSearchParams({
            'client_id': keycloakConfig.clientId,
            'client_secret': keycloakConfig.secret,
            'grant_type': 'client_credentials',
        });
        return this.requestToken(tokenUrl, serviceParams).pipe(
            map((response) => response.data.access_token)
        );
    }

    login(email: string, password: string): Observable<any> {
        const tokenUrl = keycloakConfig.tokenEndpoint;
        this.setGrantType('password');
        const serviceParams = new URLSearchParams({
            'client_id': keycloakConfig.clientId,
            'client_secret': keycloakConfig.secret,
            'grant_type': 'password',
            'username': email,
            'password': password,
        });
        return this.requestToken(tokenUrl, serviceParams).pipe(
            map((response) => response.data.access_token)
        );
    }

    // createUser(user: SignupDto): Observable<string> {
    //     const userAdapter = new SingupAdapter();
    //     const userKeyclock = userAdapter.signupAdapter(user);
    //     const tokenUrl = keycloakConfig.tokenEndpoint;
    //     const serviceParams = new URLSearchParams({
    //         'client_id': keycloakConfig.clientId,
    //         'client_secret': keycloakConfig.secret,
    //         'grant_type': 'client_credentials',
    //     });
    //     return this.requestToken(tokenUrl, serviceParams).pipe(
    //         catchError((error: AxiosError) => {
    //             return throwError(() => HttpErrorHandler.handle(error));
    //         }),
    //         map((response) => {
    //             return response.data.access_token;
    //         }),
    //         switchMap((token) => {
    //             return this.httpService.post(keycloakConfig.userEndpoint, userKeyclock, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json'
    //                 }
    //             }).pipe(
    //                 map((response) => {
    //                     return response.data;
    //                 }),
    //                 catchError((error: AxiosError) => {
    //                     return throwError(() => HttpErrorHandler.handle(error));
    //                 })
    //             );
    //         })
    //     );
    // }



    // createUser(user: UserKeyclock): Observable<string> {
    //     return this.getAdminToken().pipe(
    //         catchError((error: AxiosError) => {
    //             return throwError(() => HttpErrorHandler.handle(error));
    //         }),
    //         switchMap((token) => {
    //             return this.httpService.post(keycloakConfig.userEndpoint, user, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json'
    //                 }
    //             }).pipe(
    //                 map((response) => {
    //                     // Extract user ID from Location header or response
    //                     const location = response.headers?.location;
    //                     if (location) {
    //                         const userId = location.split('/').pop();
    //                         return userId || 'User created successfully';
    //                     }
    //                     return 'User created successfully';
    //                 }),
    //                 catchError((error: AxiosError) => {
    //                     return throwError(() => HttpErrorHandler.handle(error));
    //                 })
    //             );
    //         })
    //     );
                            
    // }



    updateUser(user: User): Observable<string> {
        throw new Error('Method not implemented.');
    }
    deleteUser(user: User): Observable<string> {
        throw new Error('Method not implemented.');
    }



}
