import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { UserInterface } from "./auth.model";

export const GetUser = createParamDecorator((data, req: ExecutionContext): UserInterface => {
    const logger = new Logger("TasksController")
    const request = req.switchToHttp().getRequest();
    // logger.log(`Request was made by user ${request.user}`)
    return request.user;
});
