import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomersModule } from './customers/customers.module';
import { AddressesModule } from './addresses/addresses.module';
import { ContactsModule } from './contacts/contacts.module';
import { Customer } from './customers/entities/customer.entity';
import { Address } from './addresses/entities/address.entity';
import { Contact } from './contacts/entities/contact.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'crm_db',
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== 'production',
      models: [Customer, Address, Contact],
      logging: process.env.NODE_ENV === 'development',
    }),
    CustomersModule,
    AddressesModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
