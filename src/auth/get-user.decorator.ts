import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserInterface } from "./auth.model";

export const GetUser = createParamDecorator((data, req: ExecutionContext): UserInterface => {
    const request = req.switchToHttp().getRequest();
    return request.user;
});
