export type ValidationResult = { error: any; value: any }
export type ValidationRule = (value: any, data?: any) => ValidationResult

class ValidatorBuilder {
   private rules: ValidationRule[] = []
   private isOptional = false
   private isNullable = false
   private requiredMsg = 'Requerido'
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
      if (msg) this.requiredMsg = msg
      return this
   }

   _addRule(fn: ValidationRule): this {
      this.rules.push(fn)
      return this
   }

   string(m = 'Debe ser string'): this {
      return this._addRule((v) => ({ error: typeof v === 'string' ? null : m, value: v }))
   }
   object(m = 'Debe ser objeto'): this {
      return this._addRule((v) => ({
         error: typeof v === 'object' && v !== null && !Array.isArray(v) ? null : m,
         value: v,
      }))
   }
   array(m = 'Debe ser array'): this {
      return this._addRule((v) => ({ error: Array.isArray(v) ? null : m, value: v }))
   }

   number(m = 'Debe ser número'): this {
      return this._addRule((v) => {
         const n = Number(v)
         const ok = v !== '' && v !== null && !isNaN(n)
         return { error: ok ? null : m, value: ok ? n : v }
      })
   }
   integer(m = 'Debe ser entero'): this {
      return this._addRule((v) => {
         const n = Number(v)
         const ok = v !== '' && v !== null && Number.isInteger(n)
         return { error: ok ? null : m, value: ok ? n : v }
      })
   }
   boolean(m = 'Debe ser booleano'): this {
      return this._addRule((v) => {
         if (typeof v === 'boolean') return { error: null, value: v }
         if (v === 'true' || v === '1' || v === 1) return { error: null, value: true }
         if (v === 'false' || v === '0' || v === 0) return { error: null, value: false }
         return { error: m, value: v }
      })
   }

   min(len: number, m = 'Demasiado corto'): this {
      return this._addRule((v) => ({
         error: v !== null && v !== undefined && String(v).length >= len ? null : m,
         value: v,
      }))
   }
   max(len: number, m = 'Demasiado largo'): this {
      return this._addRule((v) => ({
         error: v !== null && v !== undefined && String(v).length <= len ? null : m,
         value: v,
      }))
   }

   or(other: ValidatorBuilder): ValidatorBuilder {
      const current = this
      const branch = new ValidatorBuilder()
      return branch._addRule((v, d) => {
         const r1 = current.run(v, d)
         if (r1.errors.length === 0) return { error: null, value: r1.value }
         const r2 = other.run(v, d)
         if (r2.errors.length === 0) return { error: null, value: r2.value }
         return { error: 'OR mismatch', value: v }
      })
   }
   and(other: ValidatorBuilder): ValidatorBuilder {
      const current = this
      const branch = new ValidatorBuilder()
      return branch._addRule((v, d) => {
         const r1 = current.run(v, d)
         if (r1.errors.length > 0) return { error: r1.errors[0], value: v }
         const r2 = other.run(r1.value, d)
         return { error: r2.errors[0] || null, value: r2.value }
      })
   }

   elements(builder: ValidatorBuilder): this {
      return this._addRule((v) => {
         if (!Array.isArray(v)) return { error: 'Debe ser array', value: v }
         const errors: any[] = []
         const values: any[] = []
         v.forEach((it, idx) => {
            const res = builder.run(it)
            if (res.errors.length > 0) errors.push({ index: idx, errors: res.errors })
            values.push(res.value)
         })
         return { error: errors.length > 0 ? errors : null, value: values }
      })
   }

   record(builder: ValidatorBuilder): this {
      return this._addRule((v) => {
         if (typeof v !== 'object' || v === null || Array.isArray(v)) return { error: 'Debe ser objeto', value: v }
         const errs: any = {}
         const vals: any = {}
         for (const k in v) {
            const res = builder.run(v[k])
            if (res.errors.length > 0) errs[k] = res.errors
            vals[k] = res.value
         }
         return { error: Object.keys(errs).length > 0 ? errs : null, value: vals }
      })
   }

   schema(s: Record<string, any>): this {
      return this._addRule((v) => {
         const res = validate(v, s)
         return { error: res.success ? null : res.errors, value: res.data }
      })
   }

   email(m = 'Email inválido'): this {
      return this._addRule((v) => ({ error: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) ? null : m, value: v }))
   }
   uuid(m = 'UUID inválido'): this {
      return this._addRule((v) => ({
         error: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v)) ? null : m,
         value: v,
      }))
   }
   url(m = 'URL inválida'): this {
      return this._addRule((v) => {
         try {
            new URL(v)
            return { error: null, value: v }
         } catch {
            return { error: m, value: v }
         }
      })
   }
   date(m = 'Fecha inválida'): this {
      return this._addRule((v) => {
         const d = new Date(v)
         return { error: !isNaN(d.getTime()) ? null : m, value: d }
      })
   }
   oneOf(vals: any[], m = 'Valor fuera de rango'): this {
      return this._addRule((v) => ({ error: vals.includes(v) ? null : m, value: v }))
   }
   json(m = 'JSON inválido'): this {
      return this._addRule((v) => {
         try {
            return { error: null, value: JSON.parse(v) }
         } catch {
            return { error: m, value: v }
         }
      })
   }
   truthy(m = 'Debe ser verdadero'): this {
      return this._addRule((v) => ({ error: !!v ? null : m, value: v }))
   }
   port(m = 'Puerto inválido'): this {
      return this._addRule((v) => {
         const p = Number(v)
         return { error: Number.isInteger(p) && p >= 0 && p <= 65535 ? null : m, value: v }
      })
   }
   slug(m = 'Slug inválido'): this {
      return this._addRule((v) => ({ error: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(v)) ? null : m, value: v }))
   }
   hexColor(m = 'Color hex inválido'): this {
      return this._addRule((v) => ({
         error: /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(String(v)) ? null : m,
         value: v,
      }))
   }

   equalsField(f: string, m = 'Los campos no coinciden'): this {
      return this._addRule((v, d) => ({ error: v === d?.[f] ? null : m, value: v }))
   }
   refine(fn: (v: any, data?: any) => boolean, m = 'Fallo de refinamiento'): this {
      return this._addRule((v, data) => ({ error: fn(v, data) ? null : m, value: v }))
   }
   transform(fn: (v: any) => any): this {
      return this._addRule((v) => ({ error: null, value: fn(v) }))
   }

   run(value: any, data?: any): { errors: any[]; value: any } {
      let cur = value === undefined ? this.defaultValue : value
      if (cur === null && this.isNullable) return { errors: [], value: null }
      const empty = cur === undefined || cur === null || cur === ''
      if (empty) {
         if (this.isOptional) return { errors: [], value: cur }
         return { errors: [this.requiredMsg], value: cur }
      }
      const es: any[] = []
      for (const r of this.rules) {
         const res = r(cur, data)
         if (res.error) {
            if (Array.isArray(res.error)) es.push(...res.error)
            else es.push(res.error)
         }
         cur = res.value
      }
      return { errors: es, value: cur }
   }
}

export const validate = <T>(data: any, schema: Record<string, any>, options: { strict?: boolean } = {}) => {
   const errors: any = {}
   const validated: any = {}
   for (const f in schema) {
      if (schema[f] instanceof ValidatorBuilder) {
         const res = schema[f].run(data?.[f], data)
         if (res.errors.length > 0) errors[f] = res.errors
         else validated[f] = res.value
      }
   }
   if (options.strict && data) {
      const keys = Object.keys(schema)
      for (const k in data) if (!keys.includes(k)) errors[k] = ['Campo no permitido']
   }
   const ok = Object.keys(errors).length === 0
   return { success: ok, errors: ok ? null : errors, data: ok ? (validated as T) : null }
}

const createBuilder =
   (key: string) =>
   (...args: any[]) =>
      (new ValidatorBuilder() as any)[key](...args)

export const string = createBuilder('string')
export const object = createBuilder('object')
export const array = createBuilder('array')
export const number = createBuilder('number')
export const integer = createBuilder('integer')
export const boolean = createBuilder('boolean')
export const date = createBuilder('date')
export const optional = () => new ValidatorBuilder().optional()
export const nullable = () => new ValidatorBuilder().nullable()
export const nullish = () => new ValidatorBuilder().nullish()
export const oneOf = createBuilder('oneOf')
export const uuid = createBuilder('uuid')
export const url = createBuilder('url')
export const email = createBuilder('email')
export const schema = createBuilder('schema')
export const elements = createBuilder('elements')
export const record = createBuilder('record')
export const json = createBuilder('json')
export const truthy = createBuilder('truthy')
export const slug = createBuilder('slug')
export const hexColor = createBuilder('hexColor')
export const port = createBuilder('port')
export const equalsField = createBuilder('equalsField')
