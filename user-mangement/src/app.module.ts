import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { keycloakConfig } from './config/keyclock.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { KeyclockService } from './keyclock/keyclock.service';
import { HttpModule } from '@nestjs/axios';
import { KeyclockModule } from './keyclock/keyclock.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: keycloakConfig.authServerUrl,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
      secret: keycloakConfig.secret,
      useNestLogger: true,
    }),
    AuthModule,
    HttpModule,
    KeyclockModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService,

    {
      provide: APP_GUARD,
      useClass: AuthGuard, // checks access token and user auth
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard, // checks resource-based permissions
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard, // checks realm/client roles
    },
    KeyclockService,


  ],
})
export class AppModule {}
