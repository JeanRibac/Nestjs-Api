import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './DataTransferObject/create-task.dto';
import { GetTasksFilterDto } from './DataTransferObject/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ){}

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);
    }

    //old way
    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }
    
    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
    //     const {status, search} = filterDto;
    //     let tasks = this.getAllTasks();
    //     if(status){
    //         tasks = tasks.filter(task => task.status === status)
    //     }
    //     if(search){
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //         )
    //     }
    //     return tasks;
    // }

    //data persistence way
    async getTaskById(id: number) :Promise<Task>{
        const found = await this.taskRepository.findOne(id);
        if(!found){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    //old way
    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);
    //     if(!found){
    //         throw new NotFoundException(`Task with ID "${id}" not found`);
    //     }
    //     return found;
    // }

    //data persistence way
    async createTask(CreateTaskDto: CreateTaskDto){
        return this.taskRepository.createTask(CreateTaskDto);
    }   

    //old way
    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     };
    //     this.tasks.push(task);
    //     return task;
    // }

    //data persistence way
    async deleteTask(id: number): Promise<void> {
        const deleted = await this.taskRepository.delete(id); 
        if(deleted.affected === 0){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    //old way
    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     //filter all tasks and removes the one that has the same id as the one given
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);    
    //     return this.tasks
    // }

    //data persistence way
    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task>{
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

     //old way
    // updateTaskStatus(id: string, status: TaskStatus): Task{
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
