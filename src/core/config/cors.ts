import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions: CorsOptions = {
  origin: ['https://rk-tech.shop', 'http://192.168.1.109:3000', 'http://127.0.0.1:5500', 'https://972e-176-112-142-86.eu.ngrok.io'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'access-control-expose-headers'],
  credentials: true
};
