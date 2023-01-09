import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'

@Table({
  modelName: 'Values'
})

export class Value extends Model<Value> {
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

  @Column({ type: DataType.BOOLEAN })
  declare visible: boolean

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
