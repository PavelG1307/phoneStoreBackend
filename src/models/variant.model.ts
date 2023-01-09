import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'
import { Product } from './product.model'

@Table({
  modelName: 'Variants'
})

export class Variant extends Model<Variant> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  declare id?: number

  @Column({
    type: DataType.TEXT,
  })
  declare name: string

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    defaultValue: []
  })
  declare images?: string[]

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  declare visible?: boolean

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  declare is_default: boolean

  @Column({
    type: DataType.INTEGER,
    unique: true
  })
  declare option_value_id?: number

  @Column({
    type: DataType.JSON,
    unique: true
  })
  declare optionsInfo?: Partial<Product>

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
