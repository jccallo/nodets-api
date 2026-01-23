export type ValidationResult = { error: any; value: any }
export type ValidationRule = (value: any) => ValidationResult

class ValidatorBuilder {
   private rules: ValidationRule[] = []
   private isOptional = false
   private isNullable = false
   private requiredMsg: string | null = null

   optional(): this {
      this.isOptional = true
      return this
   }

   nullable(): this {
      this.isNullable = true
      return this
   }

   required(message: string): this {
      this.requiredMsg = message
      return this
   }

   private _addRule(fn: ValidationRule): this {
      this.rules.push(fn)
      return this
   }

   // --- STRINGS ---
   string(message: string): this {
      return this._addRule((v) => ({ error: typeof v === 'string' ? null : message, value: v }))
   }

   base64(message: string): this {
      const regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
      return this._addRule((v) => ({ error: typeof v === 'string' && regex.test(v) ? null : message, value: v }))
   }

   // --- FILES ---
   file(options: { maxSize?: number; allowedTypes?: string[] } = {}, message: string): this {
      return this._addRule((v) => {
         const isFile = v && typeof v === 'object' && (v.size !== undefined || v.mimetype !== undefined)
         if (!isFile) return { error: message, value: v }
         if (options.maxSize && v.size > options.maxSize) return { error: `File too large`, value: v }
         if (options.allowedTypes && !options.allowedTypes.includes(v.mimetype))
            return { error: `Invalid type`, value: v }
         return { error: null, value: v }
      })
   }

   image(message: string): this {
      return this._addRule((v) => {
         if (typeof v === 'string' && v.startsWith('data:image/')) return { error: null, value: v }
         if (v && typeof v === 'object' && v.mimetype?.startsWith('image/')) return { error: null, value: v }
         return { error: message, value: v }
      })
   }

   // ... (Rest of basic rules)
   number(message: string): this {
      return this._addRule((v) => {
         const n = Number(v)
         return { error: !isNaN(n) ? null : message, value: n }
      })
   }
   integer(message: string): this {
      return this._addRule((v) => {
         const n = Number(v)
         return { error: Number.isInteger(n) ? null : message, value: n }
      })
   }
   boolean(message: string): this {
      return this._addRule((v) => {
         if (typeof v === 'boolean') return { error: null, value: v }
         return { error: message, value: v }
      })
   }

   schema(innerSchema: Record<string, any>): this {
      return this._addRule((v) => {
         const result = validate(v, innerSchema)
         return { error: result.success ? null : result.errors, value: result.data }
      })
   }

   run(value: any): { errors: any[]; value: any } {
      if (value === null && this.isNullable) return { errors: [], value: null }
      const isEmpty = value === undefined || value === null || value === ''
      if (isEmpty) {
         if (this.isOptional) return { errors: [], value }
         return { errors: [this.requiredMsg || 'Required'], value }
      }
      let currentValue = value
      const errors: any[] = []
      for (const rule of this.rules) {
         const result = rule(currentValue)
         if (result.error) errors.push(result.error)
         currentValue = result.value
      }
      return { errors, value: currentValue }
   }
}

export const string = (m: string) => new ValidatorBuilder().string(m)
export const base64 = (m: string) => new ValidatorBuilder().base64(m)
export const file = (opt: any, m: string) => new ValidatorBuilder().file(opt, m)
export const image = (m: string) => new ValidatorBuilder().image(m)
export const schema = (s: Record<string, any>) => new ValidatorBuilder().schema(s)
export const validate = (data: any, validationSchema: Record<string, any>) => {
   const errors: any = {}
   const validatedData: any = { ...data }
   for (const field in validationSchema) {
      const result = validationSchema[field].run(data[field])
      if (result.errors.length > 0) errors[field] = result.errors
      else validatedData[field] = result.value
   }
   const isValid = Object.keys(errors).length === 0
   return { success: isValid, errors: isValid ? null : errors, data: isValid ? validatedData : null }
}
