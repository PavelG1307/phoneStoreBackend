import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PromoCode } from 'src/models/promoCode.model';
import { UserModule } from 'src/user/user.module';
import { PromoCodeController } from './promocode.controller';
import { PromoCodeService } from './promocode.service';

@Module({
    controllers: [PromoCodeController],
    providers: [PromoCodeService],
    imports: [
        SequelizeModule.forFeature([PromoCode]),
        UserModule
    ],
    exports: [
        PromoCodeService
    ]})
export class PromoCodeModule {}
