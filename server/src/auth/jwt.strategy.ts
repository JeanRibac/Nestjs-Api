import { Injectable, Inject, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as config from 'config'
import { JwtPayload } from './jwt-payload.interface';
import { UserInterface } from './auth.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger("Jwt.Strategy")
    constructor(
        @InjectModel("User")
        private readonly userModel: Model<UserInterface>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'topSecret51',
        })
    }
    async validate(payload: JwtPayload){
        const {name} = payload;
        // this.logger.log(`Payload name is ${name}`)
        const user = await this.userModel.findOne({name}).exec();
        if(!user){
            throw new UnauthorizedException();
        }
        return user
    }
}
