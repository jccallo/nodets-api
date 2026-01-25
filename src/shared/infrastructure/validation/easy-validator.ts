export type ValidationResult = { valid: boolean; error: string; value: any }
export type ValidationRule = (value: any) => ValidationResult

export class EasyValidator {
   private rules: ValidationRule[] = []
   private isOptional = false
   private isNullable = false
   private requiredMsg = 'Este campo es obligatorio'

   optional(): this {
      this.isOptional = true
      return this
   }

   nullable(): this {
      this.isNullable = true
      return this
   }

   private _addRule(fn: ValidationRule): this {
      this.rules.push(fn)
      return this
   }

   string(msg = 'Debe ser una cadena de texto'): this {
      return this._addRule((v) => ({
         valid: typeof v === 'string',
         error: msg,
         value: v,
      }))
   }

   min(n: number, msg = `Debe tener al menos ${n} caracteres`): this {
      return this._addRule((v) => ({
         valid: String(v).length >= n,
         error: msg,
         value: v,
      }))
   }

   max(n: number, msg = `Debe tener máximo ${n} caracteres`): this {
      return this._addRule((v) => ({
         valid: String(v).length <= n,
         error: msg,
         value: v,
      }))
   }

   inList(list: any[], msg = 'El valor no está en la lista permitida'): this {
      const lowerList = list.map((item) => String(item).toLowerCase())
      return this._addRule((v) => ({
         valid: lowerList.includes(String(v).toLowerCase()),
         error: msg,
         value: v,
      }))
   }

   includes(sub: string, msg = `Debe contener el valor: ${sub}`): this {
      const lowerSub = String(sub).toLowerCase()
      return this._addRule((v) => ({
         valid: String(v).toLowerCase().includes(lowerSub),
         error: msg,
         value: v,
      }))
   }

   run(value: any): { errors: string[]; value: any } {
      if (value === null && this.isNullable) return { errors: [], value: null }

      if (value === undefined || value === null || value === '') {
         if (this.isOptional) return { errors: [], value: undefined }
         return { errors: [this.requiredMsg], value }
      }

      const errors: string[] = []
      let currentValue = value

      for (const rule of this.rules) {
         const result = rule(currentValue)
         if (!result.valid) {
            errors.push(result.error)
         }
         currentValue = result.value
      }

      return { errors, value: currentValue }
   }
}

export interface ValidationOutput<T> {
   success: boolean
   errors: Record<string, string[]> | null
   data: T | null
}

export const validate = <T>(data: any, schema: Record<string, EasyValidator>): ValidationOutput<T> => {
   const errors: Record<string, string[]> = {}
   const validatedData: any = {}
   let hasErrors = false

   for (const key in schema) {
      const validator = schema[key]
      if (validator instanceof EasyValidator) {
         const res = validator.run(data[key])
         if (res.errors.length > 0) {
            errors[key] = res.errors
            hasErrors = true
         } else if (res.value !== undefined) {
            validatedData[key] = res.value
         }
      }
   }

   return {
      success: !hasErrors,
      errors: hasErrors ? errors : null,
      data: hasErrors ? (validatedData as T) : null,
   }
}

export const string = () => new EasyValidator().string()
export const optional = () => new EasyValidator().optional()
export const nullable = () => new EasyValidator().nullable()
