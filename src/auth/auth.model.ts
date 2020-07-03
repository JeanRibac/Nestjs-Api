import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
export const UserSchema = new Schema({
  name:{
    type: String,
    required: false,
    unique: true
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