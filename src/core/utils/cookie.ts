import { Request } from 'express'

export const cookieExtractor = (request: Request): string | null => {
    let token = null;
    if (request && request.cookies) {
      token = request.cookies['jwt1'];
    }
    return token;
  };