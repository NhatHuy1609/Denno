import { z } from "zod";

// Create a generic Zod schema for PaginatedResult
export const createPaginatedResultSchema = <T extends z.ZodType>(itemSchema: T): z.ZodObject<{
  items: z.ZodArray<T>;
  totalCount: z.ZodNumber;
  pageNumber: z.ZodNumber;
  pageSize: z.ZodNumber;
  totalPages: z.ZodNumber;
}> => {
  return z.object({
    items: z.array(itemSchema),
    totalCount: z.number().int().nonnegative(),
    pageNumber: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  });
};