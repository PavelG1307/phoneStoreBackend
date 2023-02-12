import { CookieOptions } from "express";

const h = 3600000

export const cookieConstants: { 
  accessTokenOptions: CookieOptions
  refreshTokenOptions: CookieOptions
}= {
  accessTokenOptions: {
    httpOnly: true,
    secure: true,
    maxAge: 2 * h,
    path: 'http://127.0.0.1:5500/',
    sameSite: 'none'
  },
  refreshTokenOptions: {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * h,
    path: '/',
    sameSite: 'none'
  }
};