import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import * as config from 'config'
import { JwtPayload } from './jwt-payload.interface';
import { UserInterface } from './auth.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel("User")
        private readonly userModel: Model<UserInterface>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
        })
    }
    async validate(payload: JwtPayload){
        const {username} = payload;
        const user = await this.userModel.findOne({username})
        if(!user){
            throw new UnauthorizedException();
        }
        return user
    }
}