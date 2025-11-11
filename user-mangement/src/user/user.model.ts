import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    CreatedAt,
    UpdatedAt,
  } from 'sequelize-typescript';


  @Table({ tableName: 'user' })
  export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    firstName: string;


    @Column({ type: DataType.STRING, allowNull: false })
    lastName: string;


    @Column({ type: DataType.STRING, allowNull: false })
    email: string;


    @Column({ type: DataType.JSONB, allowNull: false })
    username: string;



  }




  @Table({ tableName: 'outbox' })
  export class OutboxEvent extends Model<OutboxEvent> {

    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    eventType: string; // e.g., 'USER_CREATED'

    @Column({ type: DataType.JSONB, allowNull: false })
    payload: Record<string, any>;


    @Column({ type: DataType.INTEGER })
    aggregateId: number;


    @Column({ defaultValue: 'PENDING' })
    status: 'PENDING' | 'PROCESSED' | 'FAILED';
  
    @Column({ defaultValue: 0 })
    retryCount: number;
  
    @Column(DataType.TEXT)
    errorMessage: string;


    
  }