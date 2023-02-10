export const jwtConstants = {
    secret: process.env.SECRET_JWT_KEY,
    expiresIn: '7200s',
    accessTokenOptions: {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'none'
    },
    refreshTokenOptions: {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'none'
    }
};