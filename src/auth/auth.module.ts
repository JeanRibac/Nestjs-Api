import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { MongooseModule } from '@nestjs/mongoose';
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
  ]
})
export class AuthModule {}


