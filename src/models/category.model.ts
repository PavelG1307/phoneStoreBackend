import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt
} from 'sequelize-typescript'
import { UUID } from './types'

@Table({
  modelName: 'Categories'
})

export class Category extends Model<Category> {
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

  @Column({
    type: DataType.UUID,
  })
  declare parentUUID?: UUID

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDeleted?: boolean

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
