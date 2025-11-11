import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './auth.dto';
import { keycloakConfig } from 'src/config/keyclock.config';
import axios from 'axios';
import { Unprotected } from 'nest-keycloak-connect';  // 👈 import this
import { KeyclockService } from 'src/keyclock/keyclock.service';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { LoginResponse } from './interface/login.interface';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {


    constructor(private readonly authService: AuthService
    ) {}


@Unprotected()
@Post('login')
async login(@Body() loginDto: LoginDto) {
    const response =  this.authService.login(loginDto.email, loginDto.password);
    return response
}



// @Unprotected()
// @Post('signup')
// async signup(@Body() signupDto: SignupDto) {
//     return this.authService.signup(signupDto);
// }



// @Get('callback')
// async callback(@Query('code') code: string) {
//   return this.authService.callback(code);
// }





}