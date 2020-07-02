import * as mongoose from "mongoose";
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';


export const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: false,
    unique:true
  },
  password:{
    type: String,
    required: false,
  },
  salt:{
    type: String,
    required: false,
  },
  tasks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }]
})

export interface UserInterface extends mongoose.Document{
  id: string,
  username: string,
  password: string,
  salt: string,
  // tasks: [],
}
// UserSchema.methods.validatePassword = async function(password: string): Promise<boolean>{
//   // salt = this.salt;
//   const hash = await bcrypt.hash(password, this.salt);
//   return hash === this.password;
// }
// UserSchema.methods.validateUserPassword = async function(authCredentialsDto: AuthCredentialsDto): Promise<string>{
//   const {name, password} = authCredentialsDto;
//   console.log("authCredentialsDto:", authCredentialsDto)
//   const username = await this.model('User').findOne({name});
//   // console.log(username)
//   if(name && await this.validatePassword(password)){
//     return username.user;
//   }else{
//     return null
//   }
// }

// export default mongoose.model('User', UserSchema);