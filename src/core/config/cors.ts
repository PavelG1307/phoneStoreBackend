import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions: CorsOptions = {
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://192.168.1.109:3000',
    'https://rk-tech.shop',
    'https://alpha.rk-tech.shop',
    'http://172.20.10.2:3000',
    'http://192.168.1.42:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
