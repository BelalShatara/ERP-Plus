import { Transaction } from 'sequelize';
import { TransactionService } from './transaction.service';

export abstract class BaseService {
  constructor(protected readonly transactionService: TransactionService) {}

  protected async executeInTransaction<T>(
    callback: (transaction: Transaction) => Promise<T>,
    isolationLevel: Transaction.ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS
      .READ_COMMITTED,
  ): Promise<T> {
    return this.transactionService.executeInTransaction(
      callback,
      isolationLevel,
    );
  }

  protected async getTransaction(
    isolationLevel: Transaction.ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS
      .READ_COMMITTED,
  ): Promise<Transaction> {
    return this.transactionService.getTransaction(isolationLevel);
  }

  protected async commitTransaction(transaction: Transaction): Promise<void> {
    return this.transactionService.commitTransaction(transaction);
  }

  protected async rollbackTransaction(transaction: Transaction): Promise<void> {
    return this.transactionService.rollbackTransaction(transaction);
  }
}
