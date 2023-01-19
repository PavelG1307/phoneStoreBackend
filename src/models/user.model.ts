import {
  Table,
  Model,
  Column,
  DataType,
  UpdatedAt,
  CreatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'Users',
  timestamps: true,
})

export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataType.UUIDV4
  })
  declare uuid?: string

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false
  })
  declare login: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  declare passwordHash: string

  @Column({
    type: DataType.TEXT,
  })
  declare name: string

  @Column({ type: DataType.STRING, defaultValue: 'USER' })
  declare role?: boolean

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
