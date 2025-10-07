import type { PrismaClient } from '@prisma/client';

type DuplicateCheckConfig<T> = {
  field: keyof T;
  value: any;
  required: boolean;
  errorMessage: string;
  errorType: string;
  excludeId?: string;
};

type DuplicateCheckResult = {
  success: boolean;
  error: string | null;
  errorType: string | null;
};

export async function checkForDuplicates<T>(
  prisma: PrismaClient,
  model: any, // Prisma model (e.g., prisma.product)
  checks: DuplicateCheckConfig<T>[]
): Promise<DuplicateCheckResult> {
  for (const check of checks) {
    // Skip check if field is not required and value is empty
    if (!check.required && !check.value) continue;

    const whereClause: any = {
      [check.field]: check.value,
      deletedAt: null,
    };

    // Exclude the current record if excludeId is provided
    if (check.excludeId) {
      whereClause.id = {
        not: check.excludeId,
      };
    }

    const existingRecord = await model.findFirst({
      where: whereClause,
    });

    if (existingRecord) {
      return {
        success: false,
        error: check.errorMessage,
        errorType: check.errorType,
      };
    }
  }

  return {
    success: true,
    error: null,
    errorType: null,
  };
}