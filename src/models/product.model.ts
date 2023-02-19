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
import { Category } from './category.model'
import { UUID, Variant, OptionList } from './types'

@Table({
  modelName: 'Products'
})

export class Product extends Model<Product> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true
  })
  declare uuid?: UUID

  @Column({
    type: DataType.TEXT,
  })
  declare name: string

  @Column({ type: DataType.INTEGER })
  declare price: number

  @Column({
    type: DataType.INTEGER
  })
  declare priceOld?: number

  @Column({ type: DataType.TEXT, defaultValue: '' })
  declare description?: string

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID
  })
  declare categoryUUID: UUID

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare visible?: boolean

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    defaultValue: []
  })
  declare images?: string[]

  @Column({
    type: DataType.ARRAY(DataType.JSON),
    defaultValue: []
  })
  declare options?: OptionList[]

  @Column({
    type: DataType.ARRAY(DataType.JSON),
    defaultValue: []
  })
  declare variants: Variant[]

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare releaseAt?: Date

  @Column({ type: DataType.INTEGER })
  @CreatedAt
  declare sortValue?: number

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDeleted?: boolean

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date

  @BelongsTo(() => Category)
  readonly category: Category
}