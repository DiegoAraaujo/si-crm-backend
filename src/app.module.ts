import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StatusesModule } from './modules/statuses/statuses.module';
import { LeadsModule } from './modules/leads/leads.module';
import { KanbanModule } from './modules/kanban/kanban.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    StatusesModule,
    LeadsModule,
    KanbanModule,
    ActivitiesModule,
    DashboardModule,
    AiModule,
  ],
})
export class AppModule {}
