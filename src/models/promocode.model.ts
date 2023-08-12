import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'
import { UUID } from './types'

@Table({
  modelName: 'PromoCode'
})

export class PromoCode extends Model<PromoCode> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true
  })
  declare uuid?: UUID

  @Column({
    type: DataType.TEXT
  })
  declare name: string

  @Column({
    type: DataType.FLOAT
  })
  declare discount: number

  @Column({
    type: DataType.DATE
  })
  declare existsUp?: Date

  @Column({ type: DataType.INTEGER })
  declare quantity?: number

  @Column({ type: DataType.BOOLEAN, defaultValue: false  })
  declare isDisabled?: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDeleted?: boolean

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}