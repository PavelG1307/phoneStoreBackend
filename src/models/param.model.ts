import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'
import { PARAM_NAMES } from 'src/params/types'

@Table({
  tableName: 'Params',
  timestamps: true,
})

export class Param extends Model<Param> {
  public static ParamNames = PARAM_NAMES

  @Column({
    type: DataType.STRING,
  })
  declare value: string

  @Column({
    type: DataType.STRING,
    unique: true
  })
  declare name: string

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
