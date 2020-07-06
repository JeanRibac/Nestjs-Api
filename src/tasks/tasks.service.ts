import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectID } from 'mongodb';
import { CreateTaskDto } from './DataTransferObject/create-task.dto';
import { GetTasksFilterDto } from './DataTransferObject/get-tasks-filter.dto';
import { TaskInterface } from "./task.model"
import { TaskStatus } from './task.status.enum';
import { UserInterface } from '../auth/auth.model'

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
@Injectable()
export class TasksService {
  private logger = new Logger("TaskRepository");
  constructor(
    @InjectModel("Task")
    private readonly taskModel: Model<TaskInterface>,
    @InjectModel("User")
    private readonly userModel: Model<UserInterface>
  ){}
    async getTasks( filterDto: GetTasksFilterDto, user: UserInterface): Promise<TaskInterface[]> {
      const {status, search} = filterDto;
      try {
        let dbQueries:Array<any> = [];
        dbQueries.push({user:user.id})
        if(status){
          dbQueries.push({status})
        }
        if(search){
          const regexSearch = new RegExp(escapeRegExp(search), 'g');
          dbQueries.push({ $or: [
              { title: regexSearch },
              { description: regexSearch },
            ]
          });
        }
        // @ts-ignore
        dbQueries = dbQueries.length > 0 ? { $and: dbQueries } : {}
        this.logger.log(`filters: ${JSON.stringify(filterDto)}`)
        const tasks = await this.taskModel.find(dbQueries);
        const Tasks = tasks.length === 1 ? "Task" : "Tasks";
        const has = tasks.length === 1 ? "has" : "have";
        this.logger.log(`${Tasks}: ${JSON.stringify(tasks.map(task => task._id))} with the next filters: ${JSON.stringify(filterDto)} ${has} been successfully fetched`)
        return tasks;
      } catch (error) {
          this.logger.error(`Failed to get tasks, Filters: ${JSON.stringify(filterDto)}`, error.stack)
          throw new InternalServerErrorException();
      }
    }

    async getTaskById(id: ObjectID, user: UserInterface): Promise<TaskInterface>{
      const found = await this.taskModel.find({_id:id, user: user.id});
      if(!found.length){
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
      return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user: UserInterface,): Promise<TaskInterface>{
      const { title, description } = createTaskDto;
      const task = {
        title,
        description,
        status: TaskStatus.OPEN,
        user
      }
      // task.user = user;
      try {
          const newTask = await this.taskModel.create(task);
          const oldUser = await this.userModel.findById(user.id);
          await oldUser.tasks.push(newTask);
          oldUser.save();
          this.logger.log(`Task has been succesfully created by user is ${JSON.stringify(user.id)} with the ${JSON.stringify(newTask.id)} task`)
          newTask.user = ""
          // this.logger.log(`Task after delete newTask.user ${JSON.stringify(newTask)}`)
          return newTask;
      } catch (error) {
        console.log(error)
          this.logger.error(`Failed to create task, provided data was: ${JSON.stringify(createTaskDto)}", error.stack`)
      }
    }

    async deleteTask(id: ObjectID, user: UserInterface): Promise<void> {
      // console.log(`id: ${id}`);
      // console.log(`user: ${user}`)
      // const found = await this.getTaskById(id, user);
      // console.log(`found: ${found}`);
      const deleted = await this.taskModel.findOneAndRemove({id, user: user.id});
      console.log(deleted)
      if(!deleted){
          throw new NotFoundException(`Task with ID "${id}" not found`);
      }
    }

    async updateTaskStatus(_id: ObjectID, status: TaskStatus): Promise<TaskInterface>{
      const task = await this.taskModel.findById(_id);
      task.status = status;
      await task.save();
      return task;
    }
}
