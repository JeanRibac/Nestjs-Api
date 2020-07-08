import * as mongoose from "mongoose";
import { TaskStatus } from './task.status.enum';
import { ObjectID } from 'mongodb';

export const TaskSchema = new mongoose.Schema({
  title:{
    type: String,
    required: false,
  },
  description:{
    type: String,
    required: false,
  },
  status:{
    type: TaskStatus,
    required: false,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
})

export interface TaskInterface {
  id: string,
  title: string,
  description: string,
  status: TaskStatus,
  user: ObjectID,
}