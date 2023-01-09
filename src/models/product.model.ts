import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'

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
  declare uuid?: uuid

  @Column({
    type: DataType.TEXT,
  })
  declare name: string

  @Column({ type: DataType.INTEGER })
  declare price: number


  @Column({
    type: DataType.INTEGER
  })
  declare price_old?: number

  @Column({ type: DataType.TEXT, defaultValue: '' })
  declare description?: string
  
  @Column({
    type: DataType.UUID
  })
  declare category?: uuid

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare visible: boolean

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    defaultValue: []
  })
  declare images?: string[]

  @Column({
    type: DataType.ARRAY(DataType.JSON),
    defaultValue: []
  })
  declare options?: {
    id: number,
    name: string,
    values: {
      id: number,
      name: string
    }[],
    variants: {
      id: number,
      images: string[],
      is_default: boolean,
      name: string,
      option_value_id: number
      optionsInfo: Product
    }[]
  }[]

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDeleted?: boolean

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
