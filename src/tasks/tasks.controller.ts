import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './DataTransferObject/create-task.dto';
import { GetTasksFilterDto } from './DataTransferObject/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}
    
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
        console.log(filterDto)
        if(Object.keys(filterDto).length){
            return this.tasksService.getTasksWithFilters(filterDto);
        }else{
            return this.tasksService.getAllTasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string):Task {
        return this.tasksService.getTaskById(id);
    }

    //you can select all body
    // @Post()
    // createTask(@Body() body){
    //     console.log('body', body)
    // }

    //or you can select different keys from the body
    // @Post()
    // createTask(
    //     @Body("title") title: string,
    //     @Body("description") description: string
    // ): Task{
    //     // console.log('title: ', title)
    //     // console.log('description: ', description)
    //     return this.tasksService.createTask(title, description);
    // }

    //or use a dto instead
    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        // console.log('title: ', title)
        // console.log('description: ', description)
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): Array<Task>{
        return this.tasksService.deleteTask(id)
    }
    @Patch("/:id/status")
    updateTaskStatus(
        @Param('id') id: string, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ):Task{
        return this.tasksService.updateTaskStatus(id, status);
    }
}
