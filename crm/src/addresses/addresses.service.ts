import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Address } from './entities/address.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { BaseService } from '../common/base.service';
import { TransactionService } from '../common/transaction.service';

@Injectable()
export class AddressesService extends BaseService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(Customer)
    private customerModel: typeof Customer,
    transactionService: TransactionService,
  ) {
    super(transactionService);
  }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    return this.executeInTransaction(async (transaction) => {
      const customer = await this.customerModel.findByPk(
        createAddressDto.customerId,
        { transaction },
      );
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${createAddressDto.customerId} not found`,
        );
      }

      if (createAddressDto.isDefault) {
        await this.addressModel.update(
          { isDefault: false },
          {
            where: {
              customerId: createAddressDto.customerId,
              addressType: createAddressDto.addressType,
            },
            transaction,
          },
        );
      }

      return await this.addressModel.create(createAddressDto, { transaction });
    });
  }

  async findAll(customerId?: number): Promise<Address[]> {
    const where: any = {};
    if (customerId) {
      where.customerId = customerId;
    }

    return await this.addressModel.findAll({
      where,
      include: ['customer'],
      order: [
        ['isDefault', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressModel.findByPk(id, {
      include: ['customer'],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.executeInTransaction(async (transaction) => {
      const address = await this.addressModel.findByPk(id, {
        include: ['customer'],
        transaction,
      });

      if (!address) {
        throw new NotFoundException(`Address with ID ${id} not found`);
      }

      if (updateAddressDto.isDefault) {
        await this.addressModel.update(
          { isDefault: false },
          {
            where: {
              customerId: address.customerId,
              addressType: updateAddressDto.addressType || address.addressType,
              id: { [Op.ne]: id },
            },
            transaction,
          },
        );
      }

      await address.update(updateAddressDto, { transaction });
      return address.reload({ include: ['customer'], transaction });
    });
  }

  async remove(id: number): Promise<void> {
    return this.executeInTransaction(async (transaction) => {
      const address = await this.addressModel.findByPk(id, { transaction });
      if (!address) {
        throw new NotFoundException(`Address with ID ${id} not found`);
      }
      await address.destroy({ transaction });
    });
  }

  async findByCustomerId(customerId: number): Promise<Address[]> {
    return await this.addressModel.findAll({
      where: { customerId },
      order: [
        ['isDefault', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }
}
