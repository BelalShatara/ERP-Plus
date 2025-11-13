import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Contact } from './entities/contact.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { BaseService } from '../common/base.service';
import { TransactionService } from '../common/transaction.service';

@Injectable()
export class ContactsService extends BaseService {
  constructor(
    @InjectModel(Contact)
    private contactModel: typeof Contact,
    @InjectModel(Customer)
    private customerModel: typeof Customer,
    transactionService: TransactionService,
  ) {
    super(transactionService);
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    return this.executeInTransaction(async (transaction) => {
      // Verify customer exists
      const customer = await this.customerModel.findByPk(
        createContactDto.customerId,
        { transaction },
      );
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${createContactDto.customerId} not found`,
        );
      }

      if (createContactDto.isPrimary) {
        await this.contactModel.update(
          { isPrimary: false },
          {
            where: {
              customerId: createContactDto.customerId,
            },
            transaction,
          },
        );
      }

      return await this.contactModel.create(createContactDto, { transaction });
    });
  }

  async findAll(customerId?: number): Promise<Contact[]> {
    const where: any = {};
    if (customerId) {
      where.customerId = customerId;
    }

    return await this.contactModel.findAll({
      where,
      include: ['customer'],
      order: [
        ['isPrimary', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactModel.findByPk(id, {
      include: ['customer'],
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return this.executeInTransaction(async (transaction) => {
      const contact = await this.contactModel.findByPk(id, {
        include: ['customer'],
        transaction,
      });

      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }

      if (updateContactDto.isPrimary) {
        await this.contactModel.update(
          { isPrimary: false },
          {
            where: {
              customerId: contact.customerId,
              id: { [Op.ne]: id },
            },
            transaction,
          },
        );
      }

      await contact.update(updateContactDto, { transaction });
      return contact.reload({ include: ['customer'], transaction });
    });
  }

  async remove(id: number): Promise<void> {
    return this.executeInTransaction(async (transaction) => {
      const contact = await this.contactModel.findByPk(id, { transaction });
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      await contact.destroy({ transaction });
    });
  }

  async findByCustomerId(customerId: number): Promise<Contact[]> {
    return await this.contactModel.findAll({
      where: { customerId },
      order: [
        ['isPrimary', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }
}
