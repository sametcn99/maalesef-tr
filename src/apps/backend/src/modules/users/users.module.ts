import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import { UsersCleanupService } from './users.cleanup.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository, UsersCleanupService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
