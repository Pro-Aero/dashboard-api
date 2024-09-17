import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    passport.authenticate('headerapikey', (err, user) => {
      if (err || !user) {
        throw new UnauthorizedException();
      }

      next();
    })(req, res, next);
  }
}
