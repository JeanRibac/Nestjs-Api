import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './DataTransferObject/create-task.dto';
import { GetTasksFilterDto } from './DataTransferObject/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}
    
    // @Get()
    // getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    //     console.log(filterDto)
    //     if(Object.keys(filterDto).length){
    //         return this.tasksService.getTasksWithFilters(filterDto);
    //     }else{
    //         return this.tasksService.getAllTasks();
    //     }
    // }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto):Promise<Task[]> {
        return this.tasksService.getTasks(filterDto);
    }
    
    // @Get('/:id')
    // getTaskById(@Param('id') id: string):Task {
    //     return this.tasksService.getTaskById(id);
    // }
    
    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }
    
    // //you can select all body
    // // @Post()
    // // createTask(@Body() body){
    // //     console.log('body', body)
    // // }

    // //or you can select different keys from the body
    // // @Post()
    // // createTask(
    // //     @Body("title") title: string,
    // //     @Body("description") description: string
    // // ): Task{
    // //     // console.log('title: ', title)
    // //     // console.log('description: ', description)
    // //     return this.tasksService.createTask(title, description);
    // // }

    // //or use a dto instead
    // @Post()
    // @UsePipes(ValidationPipe)
    // createTask(@Body() createTaskDto: CreateTaskDto): Task {
    //     // console.log('title: ', title)
    //     // console.log('description: ', description)
    //     return this.tasksService.createTask(createTaskDto);
    // }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto)
    }

    // @Delete('/:id')
    // deleteTask(@Param('id') id: string): void{
    //     return this.tasksService.deleteTask(id)
    // }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.tasksService.deleteTask(id);
    }

    // @Patch("/:id/status")
    // updateTaskStatus(
    //     @Param('id') id: string, 
    //     @Body('status', TaskStatusValidationPipe) status: TaskStatus
    // ):Task{
    //     return this.tasksService.updateTaskStatus(id, status);
    // }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ):Promise<Task>{
        return this.tasksService.updateTaskStatus(id, status);
    }
}
