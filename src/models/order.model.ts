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
  declare uuid?: UUID

  @Column({
    type: DataType.TEXT,
  })
  declare name: string

  @Column({
    type: DataType.TEXT,
  })
  declare phone_number: string

  @Column({
    type: DataType.TEXT,
  })
  declare email: string

  @HasMany(() => OrderItem, 'orderUUID')
  items: OrderItem[]

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
