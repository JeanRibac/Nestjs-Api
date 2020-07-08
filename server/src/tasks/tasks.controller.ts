import {Controller, Get, Post, Body, Param, Delete, Patch,
    Query, UsePipes, ValidationPipe, UseGuards, Logger, Put} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './DataTransferObject/create-task.dto';
import { GetTasksFilterDto } from './DataTransferObject/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task.status.enum';
import { UserInterface } from 'src/auth/auth.model';
import { GetUser } from 'src/auth/get-user.decorator';
import { TaskInterface } from './task.model';
import { ObjectID } from 'mongodb';

@Controller('/tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger("TasksController")
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: UserInterface ): Promise<TaskInterface[]> {
        // this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: ObjectID, @GetUser() user: UserInterface): Promise<TaskInterface> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: UserInterface): Promise<TaskInterface> {
        // this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user)
    }
    //
    @Delete('/:id')
    deleteTask(@Param('id') id: ObjectID, @GetUser() user: UserInterface): Promise<void>{
        return this.tasksService.deleteTask(id, user);
    }

    @Put("/:id/status")
    updateTaskStatus(
        @Param('id') id: ObjectID,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: UserInterface
    ):Promise<TaskInterface>{
        console.log(id)
        return this.tasksService.updateTaskStatus(id, user, status);
    }
}
