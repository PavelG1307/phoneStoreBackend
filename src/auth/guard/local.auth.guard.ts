import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { LocalStrategy } from '../strategy/local.strategy'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor(private LocalStrategy: LocalStrategy) {
        super();
    }
    canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { login, password } = request.body
        const user = this.LocalStrategy.validate(login, password)
        .then( user => request.user = user );
        return user
      }
      
}