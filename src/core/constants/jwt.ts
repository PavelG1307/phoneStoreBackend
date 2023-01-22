export const jwtConstants = {
    secret: process.env.SECRET_JWT_KEY,
    expiresIn: `7200s`,
    accessTokenOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'dev',
      maxAge: 2 * 60 * 60 * 1000,
      path: process.env.API_PREFIX,
    },
    refreshTokenOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'dev',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: process.env.API_PREFIX,
    }
};