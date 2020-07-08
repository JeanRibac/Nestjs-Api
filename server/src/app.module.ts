import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from '@nestjs/serve-static';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client', 'build'),
      exclude: ['/api*'],
    }),
    TasksModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/NestJsMongoIntegration'),
  ],
})
export class AppModule {}
