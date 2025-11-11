import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { KeyclockService } from 'src/keyclock/keyclock.service';
import { SignupDto } from './auth.dto';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { Sequelize } from 'sequelize';

@Injectable()
export class AuthService {

    constructor(
        private keyClockService: KeyclockService,
        private userService: UserService,
        private readonly sequelize: Sequelize
        
    ) {}




    login(email: string, password: string): Observable<any> {
        
        return this.keyClockService.login(email, password);
    }




    // signup(signupDto: SignupDto): Observable<any> {
    //     return this.keyClockService.signup(signupDto);
    // }









}
