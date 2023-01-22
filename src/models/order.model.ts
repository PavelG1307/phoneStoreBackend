import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
  HasMany,
} from 'sequelize-typescript'
import { OrderItem } from './orderItem.model'
import { UUID } from './types'

@Table({
  modelName: 'Orders'
})

export class Order extends Model<Order> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  declare readonly uuid?: UUID

  @Column({
    type: DataType.TEXT,
  })
  declare fullName: string

  @Column({
    type: DataType.TEXT,
  })
  declare phoneNumber: string

  @HasMany(() => OrderItem, 'orderUUID')
  items: OrderItem[]

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  declare communicationMethod: number

  @Column({
    type: DataType.INTEGER
  })
  declare delivery: number

  @Column({
    type: DataType.STRING,
    defaultValue: ''
  })
  declare deliveryMessage?: string

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  declare status?: number

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare readonly createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare readonly updatedAt?: Date
}
