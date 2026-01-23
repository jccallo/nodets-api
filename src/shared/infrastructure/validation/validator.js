/**
 * VALIDATOR GOD-TIER (Branching Version)
 * Zero Recursion | Snapshot Safe | Pure JS
 */
class ValidatorBuilder {
   constructor() {
      this.rules = []
      this.isOptional = false
      this.isNullable = false
      this.requiredMsg = 'Requerido'
      this.defaultValue = undefined
   }

   optional() {
      this.isOptional = true
      return this
   }
   nullable() {
      this.isNullable = true
      return this
   }
   nullish() {
      this.isOptional = true
      this.isNullable = true
      return this
   }
   default(v) {
      this.defaultValue = v
      return this
   }
   required(m) {
      if (m) this.requiredMsg = m
      return this
   }

   _addRule(fn) {
      this.rules.push(fn)
      return this
   }

   // --- BASIC ---
   string(m = 'Debe ser string') {
      return this._addRule((v) => ({ error: typeof v === 'string' ? null : m, value: v }))
   }
   object(m = 'Debe ser objeto') {
      return this._addRule((v) => ({
         error: typeof v === 'object' && v !== null && !Array.isArray(v) ? null : m,
         value: v,
      }))
   }
   array(m = 'Debe ser array') {
      return this._addRule((v) => ({ error: Array.isArray(v) ? null : m, value: v }))
   }

   number(m = 'Debe ser número') {
      return this._addRule((v) => {
         const n = Number(v)
         const ok = v !== '' && v !== null && !isNaN(n)
         return { error: ok ? null : m, value: ok ? n : v }
      })
   }
   integer(m = 'Debe ser entero') {
      return this._addRule((v) => {
         const n = Number(v)
         const ok = v !== '' && v !== null && Number.isInteger(n)
         return { error: ok ? null : m, value: ok ? n : v }
      })
   }
   boolean(m = 'Debe ser booleano') {
      return this._addRule((v) => {
         if (typeof v === 'boolean') return { error: null, value: v }
         if (v === 'true' || v === '1' || v === 1) return { error: null, value: true }
         if (v === 'false' || v === '0' || v === 0) return { error: null, value: false }
         return { error: m, value: v }
      })
   }

   // --- CONSTRAINTS ---
   min(len, m = 'Demasiado corto') {
      return this._addRule((v) => ({
         error: v !== null && v !== undefined && String(v).length >= len ? null : m,
         value: v,
      }))
   }
   max(len, m = 'Demasiado largo') {
      return this._addRule((v) => ({
         error: v !== null && v !== undefined && String(v).length <= len ? null : m,
         value: v,
      }))
   }
   length(len, m = 'Longitud inválida') {
      return this._addRule((v) => ({ error: String(v).length === len ? null : m, value: v }))
   }

   // --- LOGICAL (RECURSION-SAFE BRANCHING) ---
   or(other) {
      // Retornamos un NUEVO constructor para romper la cadena y evitar recursión
      const current = this
      return new ValidatorBuilder()._addRule((v, d) => {
         const r1 = current.run(v, d)
         if (r1.errors.length === 0) return { error: null, value: r1.value }
         const r2 = other.run(v, d)
         if (r2.errors.length === 0) return { error: null, value: r2.value }
         return { error: 'No coincide con ninguna opción', value: v }
      })
   }
   and(other) {
      const current = this
      return new ValidatorBuilder()._addRule((v, d) => {
         const r1 = current.run(v, d)
         if (r1.errors.length > 0) return { error: r1.errors[0], value: v }
         const r2 = other.run(r1.value, d)
         return { error: r2.errors[0] || null, value: r2.value }
      })
   }

   // --- COMPLEX ---
   elements(b) {
      return this._addRule((v) => {
         if (!Array.isArray(v)) return { error: 'Debe ser array', value: v }
         const es = []
         const vs = []
         v.forEach((it, i) => {
            const r = b.run(it)
            if (r.errors.length > 0) es.push({ index: i, errors: r.errors })
            vs.push(r.value)
         })
         return { error: es.length > 0 ? es : null, value: vs }
      })
   }
   record(b) {
      return this._addRule((v) => {
         if (typeof v !== 'object' || v === null || Array.isArray(v)) return { error: 'Debe ser objeto', value: v }
         const es = {}
         const vs = {}
         for (const k in v) {
            const r = b.run(v[k])
            if (r.errors.length > 0) es[k] = r.errors
            vs[k] = r.value
         }
         return { error: Object.keys(es).length > 0 ? es : null, value: vs }
      })
   }
   schema(s) {
      return this._addRule((v) => {
         const res = validate(v, s)
         return { error: res.success ? null : res.errors, value: res.data }
      })
   }

   // --- SPECIALIZED ---
   email(m = 'Email inválido') {
      return this._addRule((v) => ({ error: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) ? null : m, value: v }))
   }
   uuid(m = 'UUID inválido') {
      return this._addRule((v) => ({
         error: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v)) ? null : m,
         value: v,
      }))
   }
   url(m = 'URL inválida') {
      return this._addRule((v) => {
         try {
            new URL(v)
            return { error: null, value: v }
         } catch {
            return { error: m, value: v }
         }
      })
   }
   date(m = 'Fecha inválida') {
      return this._addRule((v) => {
         const d = new Date(v)
         return { error: !isNaN(d.getTime()) ? null : m, value: d }
      })
   }
   oneOf(vals, m = 'Valor fuera de rango') {
      return this._addRule((v) => ({ error: vals.includes(v) ? null : m, value: v }))
   }
   json(m = 'JSON inválido') {
      return this._addRule((v) => {
         try {
            return { error: null, value: JSON.parse(v) }
         } catch {
            return { error: m, value: v }
         }
      })
   }
   truthy(m = 'Debe ser verdadero') {
      return this._addRule((v) => ({ error: !!v ? null : m, value: v }))
   }
   port(m = 'Puerto inválido') {
      return this._addRule((v) => {
         const p = Number(v)
         return { error: Number.isInteger(p) && p >= 0 && p <= 65535 ? null : m, value: v }
      })
   }
   slug(m = 'Slug inválido') {
      return this._addRule((v) => ({ error: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(v)) ? null : m, value: v }))
   }
   hexColor(m = 'Color hex inválido') {
      return this._addRule((v) => ({
         error: /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(String(v)) ? null : m,
         value: v,
      }))
   }

   // --- CORE ---
   equalsField(f, m = 'Los campos no coinciden') {
      return this._addRule((v, d) => ({ error: v === d?.[f] ? null : m, value: v }))
   }
   refine(fn, m = 'Fallo de refinamiento') {
      return this._addRule((v, d) => ({ error: fn(v, d) ? null : m, value: v }))
   }
   transform(fn) {
      return this._addRule((v) => ({ error: null, value: fn(v) }))
   }

   run(value, data) {
      let cur = value === undefined ? this.defaultValue : value
      if (cur === null && this.isNullable) return { errors: [], value: null }

      const empty = cur === undefined || cur === null || cur === ''
      if (empty) {
         if (this.isOptional) return { errors: [], value: cur }
         return { errors: [this.requiredMsg], value: cur }
      }

      const es = []
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

const validate = (data, schema, opt = {}) => {
   const errors = {}
   const validated = {}
   for (const f in schema) {
      if (schema[f] instanceof ValidatorBuilder) {
         const res = schema[f].run(data?.[f], data)
         if (res.errors.length > 0) errors[f] = res.errors
         else validated[f] = res.value
      }
   }
   if (opt.strict && data) {
      const keys = Object.keys(schema)
      for (const k in data) if (!keys.includes(k)) errors[k] = ['Campo no permitido']
   }
   const ok = Object.keys(errors).length === 0
   return { success: ok, errors: ok ? null : errors, data: ok ? validated : null }
}

const createBuilder =
   (key) =>
   (...args) =>
      new ValidatorBuilder()[key](...args)

module.exports = {
   ValidatorBuilder,
   validate,
   string: createBuilder('string'),
   object: createBuilder('object'),
   array: createBuilder('array'),
   number: createBuilder('number'),
   integer: createBuilder('integer'),
   boolean: createBuilder('boolean'),
   date: createBuilder('date'),
   optional: () => new ValidatorBuilder().optional(),
   nullable: () => new ValidatorBuilder().nullable(),
   nullish: () => new ValidatorBuilder().nullish(),
   oneOf: createBuilder('oneOf'),
   uuid: createBuilder('uuid'),
   url: createBuilder('url'),
   email: createBuilder('email'),
   schema: createBuilder('schema'),
   elements: createBuilder('elements'),
   record: createBuilder('record'),
   json: createBuilder('json'),
   truthy: createBuilder('truthy'),
   slug: createBuilder('slug'),
   hexColor: createBuilder('hexColor'),
   port: createBuilder('port'),
   equalsField: createBuilder('equalsField'),
}
