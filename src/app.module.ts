import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StatusesModule } from './modules/statuses/statuses.module';
import { LeadsModule } from './modules/leads/leads.module';

@Module({
  imports: [AuthModule, UsersModule, StatusesModule, LeadsModule],
})
export class AppModule {}
