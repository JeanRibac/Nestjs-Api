import { Injectable, UnauthorizedException, Logger, InternalServerErrorException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserInterface } from './auth.model';

@Injectable()
export class AuthService {
    private logger = new Logger("AuthService")
    constructor(
        @InjectModel("User")
        private readonly userModel: Model<UserInterface>,
        private jwtService: JwtService,
    ){}

    async signUp(authCredentialsDto:AuthCredentialsDto): Promise<UserInterface>{
        const {name, password } = authCredentialsDto;
        if(password === "" || undefined){
            throw new BadRequestException("Password can't be empty!")
        }
        const salt = await bcrypt.genSalt();
        const newPassword = await bcrypt.hash(password, salt);
        const newUser = new this.userModel({
            name,
            password: newPassword,
            salt,
        })
        let result;
        try{
             result = await newUser.save();
        }catch(err){
            console.log(err.code)
            if(err.code === 11000){ //duplicate username error code
                throw new ConflictException("Username already exists")
            }else throw new InternalServerErrorException()
        }
        return result;
    }

    async signIn(authCredentialsDto: AuthCredentialsDto):Promise<{accessToken: string}>{
        const {name, password} = authCredentialsDto;
        const username = await this.userModel.findOne({name})
        if(username) {
            let foundUsername;
            const salt = username.salt;
            const hash = bcrypt.hashSync(password, salt);
            const isMatch = hash === username.password;
            if (isMatch) {foundUsername = username.name}
            else throw new UnauthorizedException("Invalid credentials")

            const payload: JwtPayload = { username: foundUsername };
            const accessToken = await this.jwtService.sign(payload);
            this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`)

            return { accessToken };
        }else if(!username){
            throw new UnauthorizedException("Invalid credentials")
        }
    }
}
