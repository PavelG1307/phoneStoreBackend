import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PromoCode } from 'src/models/promocode.model';
import { UserModule } from 'src/user/user.module';
import { PromoCodeController } from './promocode.controller';
import { PromoCodeService } from './promocode.service';
import { PromoCodeCategory } from 'src/models/promocodeCategory.model';

@Module({
    controllers: [PromoCodeController],
    providers: [PromoCodeService],
    imports: [
        SequelizeModule.forFeature([PromoCode, PromoCodeCategory]),
        UserModule
    ],
    exports: [
        PromoCodeService
    ]})
export class PromoCodeModule {}
