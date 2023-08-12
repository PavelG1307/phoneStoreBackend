import { Request } from 'express'

export const cookieOrHeaderExtractor = (request: Request): string | null => {
  let token = null;
  if (request && request.cookies) {
    token = request.cookies['_jwt1'];
  }
  if (token) return token;
  return headerExtractor(request)
};

export const headerExtractor = (request: Request): string | null => {
  try {
    let token = null;
    if (request) {
      const header = request.header('Authorization');
      if (!header) return null
      token = header.split('Bearer ')[1]
    }
    return token;
  } catch (e) {
    return null
  }
};
