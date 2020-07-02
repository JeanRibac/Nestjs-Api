import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from "bcrypt";
// import { User } from "./user.entity";
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

// @EntityRepository(User)
// export class UserRepository extends Repository<User>{
    // async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
    //     const {name, password} = authCredentialsDto;
    //
    //     const user = new User();
    //     user.name = name;
    //     user.salt = await bcrypt.genSalt();
    //     user.password = await this.hashPassword(password, user.salt);
    //     try{
    //         await user.save();
    //     }catch(err){
    //         if(err.code === "23505"){ //duplicate username error code
    //             throw new ConflictException("Username already exists")
    //         }else throw new InternalServerErrorException()
    //     }
    // }

    // async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string>{
    //     const {name, password} =authCredentialsDto;
    //     const user = await this.findOne({name});
    //     if(user && await user.validatePassword(password)){
    //         return user.name;
    //     }else{
    //         return null
    //     }
    // }

    // private async hashPassword(password: string, salt: string): Promise<string>{
    //     return bcrypt.hash(password, salt);
    // }
// }