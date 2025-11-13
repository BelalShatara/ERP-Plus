import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Customer } from '../../customers/entities/customer.entity';

@Table({
  tableName: 'addresses',
  timestamps: true,
})
export class Address extends Model<Address> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customerId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  addressType: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  addressLine1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  addressLine2: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  state: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  postalCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDefault: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  // Relationships
  @BelongsTo(() => Customer)
  customer: Customer;
}
