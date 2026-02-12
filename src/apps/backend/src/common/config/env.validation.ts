import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  GOOGLE_AI_API_KEY: Joi.string().optional(),
  GOOGLE_AI_MODEL: Joi.string(),
  ENABLE_API_DOCS: Joi.boolean().optional(),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  SERVICE_URL_BACKEND: Joi.string().uri().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),

  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_SECURE: Joi.boolean().default(false),
  MAIL_FROM: Joi.string().email().required(),

  // Seed (Admin)
  ADMIN_EMAIL: Joi.string().email().default('admin@maalesef.tr'),
  ADMIN_NAME: Joi.string().default('admin'),
  ADMIN_PASSWORD: Joi.string().default('admin123'),
});
