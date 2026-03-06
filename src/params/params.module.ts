import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Param } from 'src/models/param.model';
import { UserModule } from 'src/user/user.module';
import { ParamService } from './params.service';
import { ParamController } from './params.controller';

@Module({
    controllers: [ParamController],
    providers: [ParamService],
    imports: [
        SequelizeModule.forFeature([Param]),
        UserModule
    ]})

export class ParamModule {}
