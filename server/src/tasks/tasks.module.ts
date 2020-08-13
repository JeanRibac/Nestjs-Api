import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';
import { TaskSchema } from './task.model';
import { UserSchema } from '../auth/auth.model';

@Module({
  imports:[
    MongooseModule.forFeature([{name:"Task", schema: TaskSchema}]),
    AuthModule,
    MongooseModule.forFeature([{name:"User", schema: UserSchema}]),
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
