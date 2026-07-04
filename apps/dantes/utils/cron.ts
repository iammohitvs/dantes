import z from "zod";
import { CronExpressionParser } from "cron-parser";

export const CronExpressionScehma = z.string().refine(
  (expression) => {
    try {
      CronExpressionParser.parse(expression);
      return true;
    } catch (error) {
      return false;
    }
  },
  {
    error: "Invalid CRON expression",
  }
);

export const createNextExecutionFromCronExpression = (
  expression: string
): string => {
  return CronExpressionParser.parse(expression).next().toISOString() as string;
};
