import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'

@Table({
  modelName: 'Orders'
})

export class Order extends Model<Order> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,

  })
  declare uuid?: uuid

  @Column({
    type: DataType.TEXT,
  })
  declare first_name: string

  @Column({
    type: DataType.TEXT,
  })
  declare last_name: string

  @Column({
    type: DataType.TEXT,
  })
  declare phone_number: string

  @Column({
    type: DataType.TEXT,
  })
  declare email: string

  @Column({
    type: DataType.TEXT,
  })
  declare products: {
    products_id: number,
    variant_id: number,
    price: number,
    name: string,
    count: number
  }[]

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  declare status?: number

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
