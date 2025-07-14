
import * as Joi from 'joi';

// Validation schema for environment variables - first we import Joi
export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT : Joi.number().default(3000),
  DEFAULT_LIMIT: Joi.number().default(5),
})
