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
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggingModule } from './logging/logging.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    KeycloakConnectModule.register({
      authServerUrl: keycloakConfig.authServerUrl,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
      secret: keycloakConfig.secret,
      useNestLogger: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadModels: true,
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    HttpModule,
    KeyclockModule,
    UserModule,
    LoggingModule,
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
