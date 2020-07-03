import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateTaskDto } from './DataTransferObject/create-task.dto';
import { GetTasksFilterDto } from './DataTransferObject/get-tasks-filter.dto';
import { TaskInterface } from "./task.model"
import { TaskStatus } from './task.status.enum';
import { UserInterface } from '../auth/auth.model'
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { ObjectID } from 'typeorm';

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
@Injectable()
export class TasksService {
  private logger = new Logger("TaskRepository");
  constructor(
    @InjectModel("Task")
    private readonly taskModel: Model<TaskInterface>
  ){}
    async getTasks( filterDto: GetTasksFilterDto): Promise<TaskInterface[]> {
      // eslint-disable-next-line prefer-const
      let {status, search} = filterDto;
      try {
        let dbQueries:Array<any> = [];
        if(status){
          dbQueries.push({status:status})
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
        const tasks = await this.taskModel.find(dbQueries);
        const Tasks = tasks.length === 1 ? "Task" : "Tasks";
        const has = tasks.length === 1 ? "has" : "have";
        this.logger.log(`${Tasks}: ${JSON.stringify(tasks)} with the next filters: ${JSON.stringify(filterDto)} ${has} been successfully fetched`)
        return tasks;
      } catch (error) {
          this.logger.error(`Failed to get tasks, Filters: ${JSON.stringify(filterDto)}`, error.stack)
          console.log(error)
          throw new InternalServerErrorException();
      }
    }

    async getTaskById(id: ObjectID) :Promise<TaskInterface>{
      const found = await this.taskModel.findById(id);
      if(!found){
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
      return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<TaskInterface>{
      const { title, description } = createTaskDto;
      const task = {
        title,
        description,
        status: TaskStatus.OPEN,
      }
      // task.user = user;
      try {
          const newTask = await this.taskModel.create(task);
          // delete task.user;
          return newTask;
      } catch (error) {
        console.log(error)
          this.logger.error(`Failed to create task, provided data was: ${JSON.stringify(createTaskDto)}", error.stack`)
      }
    }

    async deleteTask(id: ObjectID): Promise<void> {
      const deleted = await this.taskModel.findByIdAndRemove(id);
      console.log(deleted)
      if(deleted.affected === 0){
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
