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
import { User } from './user.model'

@Table({
  tableName: 'RefreshTokens',
  timestamps: true,
})

export class RefreshToken extends Model<RefreshToken> {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare value?: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  declare userUUID?: UUID

  @BelongsTo(() => User)
  readonly user: User

  @Column({ type: DataType.DATE })
  @CreatedAt
  declare createdAt?: Date

  @Column({ type: DataType.DATE })
  @UpdatedAt
  declare updatedAt?: Date
}
