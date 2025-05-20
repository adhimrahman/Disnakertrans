import { ZodType } from "zod"; 

export class Validation {
  static validate<T>(schema: ZodType, formData: T) : T {
    return schema.parse(formData);
  }
}