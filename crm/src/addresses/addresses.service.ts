import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Address } from './entities/address.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(Customer)
    private customerModel: typeof Customer,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    return await this.sequelize.transaction(async (transaction) => {
      try {
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

        return await this.addressModel.create(createAddressDto, {
          transaction,
        });
      } catch (error) {
        throw error;
      }
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
    return await this.sequelize.transaction(async (transaction) => {
      try {
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
                addressType:
                  updateAddressDto.addressType || address.addressType,
                id: { [Op.ne]: id },
              },
              transaction,
            },
          );
        }

        await address.update(updateAddressDto, { transaction });
        return address.reload({ include: ['customer'], transaction });
      } catch (error) {
        throw error;
      }
    });
  }

  async remove(id: number): Promise<void> {
    return await this.sequelize.transaction(async (transaction) => {
      try {
        const address = await this.addressModel.findByPk(id, { transaction });
        if (!address) {
          throw new NotFoundException(`Address with ID ${id} not found`);
        }
        await address.destroy({ transaction });
      } catch (error) {
        throw error;
      }
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
