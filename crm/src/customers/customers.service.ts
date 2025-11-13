import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Op } from 'sequelize';
import { BaseService } from '../common/base.service';
import { TransactionService } from '../common/transaction.service';

@Injectable()
export class CustomersService extends BaseService {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
    transactionService: TransactionService,
  ) {
    super(transactionService);
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.executeInTransaction(async (transaction) => {
      if (createCustomerDto.email) {
        const existingCustomer = await this.customerModel.findOne({
          where: { email: createCustomerDto.email },
          transaction,
        });
        if (existingCustomer) {
          throw new BadRequestException(
            'Customer with this email already exists',
          );
        }
      }

      return await this.customerModel.create(createCustomerDto, {
        transaction,
      });
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    isActive?: boolean,
  ): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { rows, count } = await this.customerModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: ['addresses', 'contacts'],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerModel.findByPk(id, {
      include: ['addresses', 'contacts'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.executeInTransaction(async (transaction) => {
      const customer = await this.customerModel.findByPk(id, {
        include: ['addresses', 'contacts'],
        transaction,
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      if (
        updateCustomerDto.email &&
        updateCustomerDto.email !== customer.email
      ) {
        const existingCustomer = await this.customerModel.findOne({
          where: { email: updateCustomerDto.email },
          transaction,
        });
        if (existingCustomer) {
          throw new BadRequestException(
            'Customer with this email already exists',
          );
        }
      }

      await customer.update(updateCustomerDto, { transaction });
      return customer.reload({
        include: ['addresses', 'contacts'],
        transaction,
      });
    });
  }

  async remove(id: number): Promise<void> {
    return this.executeInTransaction(async (transaction) => {
      const customer = await this.customerModel.findByPk(id, { transaction });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      await customer.destroy({ transaction });
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.customerModel.findOne({
      where: { email },
      include: ['addresses', 'contacts'],
    });
  }
}
