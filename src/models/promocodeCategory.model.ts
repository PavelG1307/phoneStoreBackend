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
import { UUID } from './types'
import { PromoCode } from './promocode.model'
import { Category } from './category.model'

@Table({
  modelName: 'PromoCodeCategory'
})

export class PromoCodeCategory extends Model<PromoCodeCategory> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true
  })
  declare uuid?: UUID

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  declare categoryUUID: UUID

  @ForeignKey(() => PromoCode)
  @Column({
    type: DataType.UUID
  })
  declare promoCodeUUID: UUID

  @BelongsTo(() => PromoCode)
  readonly promoCode: PromoCode;

  @BelongsTo(() => Category)
  readonly category: Category;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDeleted?: boolean

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}