export const jwtConstants = {
    secret: process.env.SECRET_JWT_KEY,
    expiresIn: `7200s`,
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'dev',
        maxAge: 2 * 60 * 60 * 1000,
        path: process.env.API_PREFIX,
      }
};