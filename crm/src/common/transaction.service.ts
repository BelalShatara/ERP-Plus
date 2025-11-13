import { Injectable, Inject } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(getConnectionToken())
    private readonly sequelize: Sequelize,
  ) {}

  async executeInTransaction<T>(
    callback: (transaction: Transaction) => Promise<T>,
    isolationLevel: Transaction.ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS
      .READ_COMMITTED,
  ): Promise<T> {
    const transaction = await this.sequelize.transaction({
      isolationLevel,
    });

    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getTransaction(
    isolationLevel: Transaction.ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS
      .READ_COMMITTED,
  ): Promise<Transaction> {
    return await this.sequelize.transaction({
      isolationLevel,
    });
  }

  async commitTransaction(transaction: Transaction): Promise<void> {
    await transaction.commit();
  }

  async rollbackTransaction(transaction: Transaction): Promise<void> {
    await transaction.rollback();
  }
}
