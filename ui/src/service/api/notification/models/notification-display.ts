import { z } from 'zod';
import { EntityTypeSchema } from '../../_constants/entity-types';
import { TranslationKeySchema } from '../../_constants/translation-keys';

const EntityTypeDisplaySchema = z.object({
  id: z.union([z.string(), z.string().uuid()]),
  type: EntityTypeSchema,
  text: z.string(),
});

export const NotificationDisplaySchema = z.object({
  translationKey: TranslationKeySchema,
  entities: z.record(EntityTypeDisplaySchema),
});