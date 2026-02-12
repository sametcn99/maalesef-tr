import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'maalesef',
  entities: [join(import.meta.dirname, '../modules/**/*.entity.ts')],
  migrations: [join(import.meta.dirname, 'migrations/*.ts')],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
