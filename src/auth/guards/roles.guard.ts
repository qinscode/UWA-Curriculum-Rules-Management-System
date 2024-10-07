import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserType } from "../users/entities/user.enum";
import { Logger } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      "roles",
      [context.getHandler(), context.getClass()]
    );
    this.logger.log(`Required roles: ${JSON.stringify(requiredRoles)}`);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      this.logger.warn("User ID not found in request");
      return false;
    }

    const user = await this.usersService.findOne(userId);

    if (!user || !user.roles) {
      this.logger.warn("User or user roles not found");
      return false;
    }

    this.logger.log(`User: ${JSON.stringify(user)}`);

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    this.logger.log(`User has required role: ${hasRole}`);

    return hasRole;
  }
}
