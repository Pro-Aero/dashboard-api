import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3000),
  API_KEY: z.coerce.string(),
  MICROSOFT_CLIENT_ID: z.coerce.string(),
  MICROSOFT_CLIENT_SECRET: z.coerce.string(),
  MICROSOFT_TENANT_ID: z.coerce.string(),
});

export type Env = z.infer<typeof envSchema>;
