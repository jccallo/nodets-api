export type ValidationResult = { error: any; value: any }
export type ValidationRule = (value: any) => ValidationResult

class ValidatorBuilder {
   private rules: ValidationRule[] = []
   private isOptional = false
   private isNullable = false
   private requiredMsg: string | null = null
   private defaultValue: any = undefined

   optional(): this {
      this.isOptional = true
      return this
   }
   nullable(): this {
      this.isNullable = true
      return this
   }
   nullish(): this {
      this.isOptional = true
      this.isNullable = true
      return this
   }
   default(val: any): this {
      this.defaultValue = val
      return this
   }
   required(msg: string): this {
      this.requiredMsg = msg
      return this
   }

   private _addRule(fn: ValidationRule): this {
      this.rules.push(fn)
      return this
   }

   string(m: string): this {
      return this._addRule((v) => ({ error: typeof v === 'string' ? null : m, value: v }))
   }
   number(m: string): this {
      return this._addRule((v) => {
         const n = Number(v)
         const ok = v !== '' && v !== null && !isNaN(n)
         return { error: ok ? null : m, value: ok ? n : v }
      })
   }
   integer(m: string): this {
      return this._addRule((v) => {
         const n = Number(v)
         const ok = v !== '' && v !== null && Number.isInteger(n)
         return { error: ok ? null : m, value: ok ? n : v }
      })
   }
   boolean(m: string): this {
      return this._addRule((v) => {
         if (typeof v === 'boolean') return { error: null, value: v }
         if (v === 'true' || v === '1' || v === 1) return { error: null, value: true }
         if (v === 'false' || v === '0' || v === 0) return { error: null, value: false }
         return { error: m, value: v }
      })
   }

   min(len: number, m: string): this {
      return this._addRule((v) => ({ error: v?.length >= len ? null : m, value: v }))
   }
   max(len: number, m: string): this {
      return this._addRule((v) => ({ error: v?.length <= len ? null : m, value: v }))
   }
   email(m: string): this {
      const r = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return this._addRule((v) => ({ error: r.test(String(v)) ? null : m, value: v }))
   }
   uuid(m: string): this {
      const r = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      return this._addRule((v) => ({ error: r.test(String(v)) ? null : m, value: v }))
   }

   elements(builder: ValidatorBuilder): this {
      return this._addRule((v) => {
         if (!Array.isArray(v)) return { error: 'Debe ser array', value: v }
         const errors: any[] = []
         const values: any[] = []
         v.forEach((it, idx) => {
            const res = builder.run(it)
            if (res.errors.length > 0) errors.push({ idx, errors: res.errors })
            values.push(res.value)
         })
         return { error: errors.length > 0 ? errors : null, value: values }
      })
   }

   schema(s: Record<string, any>): this {
      return this._addRule((v) => {
         const res = validate(v, s)
         return { error: res.success ? null : res.errors, value: res.data }
      })
   }

   refine(fn: (v: any) => boolean, m: string): this {
      return this._addRule((v) => ({ error: fn(v) ? null : m, value: v }))
   }
   transform(fn: (v: any) => any): this {
      return this._addRule((v) => ({ error: null, value: fn(v) }))
   }

   run(value: any): { errors: any[]; value: any } {
      let cur = value === undefined ? this.defaultValue : value
      if (cur === null && this.isNullable) return { errors: [], value: null }
      if (cur === undefined || cur === null || cur === '') {
         if (this.isOptional) return { errors: [], value: cur }
         return { errors: [this.requiredMsg || 'Required'], value: cur }
      }
      const errs: any[] = []
      for (const r of this.rules) {
         const res = r(cur)
         if (res.error) errs.push(res.error)
         cur = res.value
      }
      return { errors: errs, value: cur }
   }
}

export const string = (m: string) => new ValidatorBuilder().string(m)
export const number = (m: string) => new ValidatorBuilder().number(m)
export const boolean = (m: string) => new ValidatorBuilder().boolean(m)
export const optional = () => new ValidatorBuilder().optional()
export const nullish = () => new ValidatorBuilder().nullish()
export const elements = (b: any) => new ValidatorBuilder().elements(b)
export const schema = (s: any) => new ValidatorBuilder().schema(s)

export const validate = <T>(data: any, validationSchema: Record<string, any>) => {
   const errors: any = {}
   const validatedData: any = {}
   for (const f in validationSchema) {
      const res = validationSchema[f].run(data[f])
      if (res.errors.length > 0) errors[f] = res.errors
      else validatedData[f] = res.value
   }
   const ok = Object.keys(errors).length === 0
   return { success: ok, errors: ok ? null : errors, data: ok ? (validatedData as T) : null }
}
