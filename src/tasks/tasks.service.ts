// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { TaskRepository } from './task.repository';
// import { CreateTaskDto } from './DataTransferObject/create-task.dto';
// import { GetTasksFilterDto } from './DataTransferObject/get-tasks-filter.dto';
// import { Task } from './task.entity'
// import { TaskInterface } from "./task.model"
// import { TaskStatus } from './task.status.enum';
// import { User } from 'src/auth/user.entity';
//
// @Injectable()
// export class TasksService {
//     constructor(
//         @InjectRepository(TaskRepository)
//         private taskRepository: TaskRepository,
//         @InjectModel("Task")
//         private readonly productModel: Model<TaskInterface>
//     ){}
//
//     async getTasks( filterDto: GetTasksFilterDto,  user: User): Promise<Task[]> {
//         return this.taskRepository.getTasks(filterDto, user);
//     }
//
//     //data persistence way
//     async getTaskById(id: number, user: User) :Promise<Task>{
//         const found = await this.taskRepository.findOne({where:{id, userId: user.id}});
//         if(!found){
//             throw new NotFoundException(`Task with ID "${id}" not found`);
//         }
//         return found;
//     }
//
//     //data persistence way
//     async createTask(CreateTaskDto: CreateTaskDto,user:User,): Promise<Task>{
//         return this.taskRepository.createTask(CreateTaskDto, user);
//     }
//
//     //data persistence way
//     async deleteTask(id: number, user: User): Promise<void> {
//         const deleted = await this.taskRepository.delete({id, userId: user.id});
//         if(deleted.affected === 0){
//             throw new NotFoundException(`Task with ID "${id}" not found`);
//         }
//     }
//
//     //data persistence way
//     async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task>{
//         const task = await this.getTaskById(id, user);
//         task.status = status;
//         await task.save();
//         return task;
//     }
// }
