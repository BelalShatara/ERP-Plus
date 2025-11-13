import { Module, Global } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionService } from './transaction.service';

@Global()
@Module({
  imports: [SequelizeModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class CommonModule {}
