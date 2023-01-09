import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'

@Table({
  modelName: 'Options'
})

export class Option extends Model<Option> {
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

  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  declare values: number[]

  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  declare variants: number[]

  @Column({ type: DataType.BOOLEAN })
  declare visible: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDeleted?: boolean

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
