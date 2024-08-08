import { z } from 'zod';

export const ResponseGetLocalesSchema = z.array(z.string());
