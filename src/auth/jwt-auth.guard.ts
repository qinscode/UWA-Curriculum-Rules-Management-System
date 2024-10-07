import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log("JwtAuthGuard: Checking JWT token");
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    this.logger.log(
      `JwtAuthGuard: Handling request. User: ${JSON.stringify(user)}`
    );
    if (err || !user) {
      this.logger.error(
        `JwtAuthGuard: Authentication failed. Error: ${err?.message}`
      );
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
