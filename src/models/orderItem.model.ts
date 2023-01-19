import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { Order } from './order.model'
import { Product } from './product.model'
import { UUID } from './types'

@Table({
  modelName: 'OrderItems'
})

export class OrderItem extends Model<OrderItem> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid?: UUID

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare orderUUID: UUID

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare productUUID: UUID

  @BelongsTo(() => Product)
  readonly products: Product[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare price: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  declare name: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: []
  })
  declare tags: string[]

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: []
  })
  declare images: string[]

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1
  })
  declare count: number

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
