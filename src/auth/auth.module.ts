import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from './auth.model';

const jwtConfig = config.get('jwt')

@Module({
  imports:[
    PassportModule.register({defaultStrategy:"jwt"}),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions:{
        expiresIn: jwtConfig.expiresIn
      }
    }),
    MongooseModule.forFeature([{name:"User", schema: UserSchema}]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[
    JwtStrategy,
    PassportModule,
    AuthService,
  ]
})
export class AuthModule {}


