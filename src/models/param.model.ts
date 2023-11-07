import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'Params',
  timestamps: true,
})

export class Param extends Model<Param> {
  public static ParamNames = {
    TELEGRAM_CHAT_ID: 'telegram_chat_id',
    POPUP_MESSAGE: 'popup_message'
  }

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
