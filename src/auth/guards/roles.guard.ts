import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
// ... other imports

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      "roles",
      [context.getHandler(), context.getClass()]
    );
    this.logger.log(`Required roles: ${JSON.stringify(requiredRoles)}`);

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    this.logger.log(`User: ${JSON.stringify(user)}`);

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    this.logger.log(`User has required role: ${hasRole}`);

    return hasRole;
  }
}
