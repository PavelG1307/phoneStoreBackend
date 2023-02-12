import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
    controllers: [StorageController],
    providers: [StorageService],
    imports: [
        UserModule
    ]})
export class StorageModule {}
