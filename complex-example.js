const v = require('./src/shared/infrastructure/validation/validator.js')

/**
 * ESCENARIO: Configuración de un "Workspace Empresarial"
 * Este esquema demuestra:
 * 1. Anidación profunda (schema).
 * 2. Listas de objetos (elements).
 * 3. Diccionarios dinámicos (record).
 * 4. Lógica condicional (or / and).
 * 5. Validación cruzada (equalsField).
 * 6. Formatos avanzados (slug, hexColor, uuid).
 */

const WorkspaceSchema = {
   // Info básica con slug y color de marca
   settings: v.schema({
      name: v.string().min(5),
      slug: v.slug('El slug debe ser formato-url-valido'),
      brandColor: v.hexColor('Color hexadecimal inválido'),
      environment: v.oneOf(['prod', 'staging', 'dev'], 'Entorno no permitido'),
   }),

   // Propietario con enlaces dinámicos
   owner: v.schema({
      id: v.uuid('ID de propietario inválido'),
      email: v.email(),
      socialLinks: v.record(v.url('Debe ser una URL válida')), // Diccionario: { twitter: 'url', github: 'url' }
   }),

   // Equipo: Lista de usuarios con validaciones internas
   team: v.array().elements(
      v.schema({
         username: v.string().min(3),
         role: v.string().default('member'),
         active: v.boolean(),
      }),
   ),

   // Seguridad: Ejemplo de OR (Puede ser un PIN numérico O una contraseña compleja)
   security: v.schema({
      authType: v.oneOf(['pin', 'password']),
      // Si es PIN, debe ser un número de 4 dígitos. Si es Password, debe tener min 8 chars.
      secret: v.integer().or(v.string().min(8)),
      // Validación cruzada
      confirmSecret: v.integer().or(v.string()).equalsField('secret', 'Los secretos no coinciden'),
   }),

   // Metadata opcional
   tags: v.array().elements(v.string()).optional(),
}

// --- DATA PARA VALIDAR ---
const complexData = {
   settings: {
      name: 'Antigravity Workspace',
      slug: 'antigravity-hq',
      brandColor: '#6C5CE7',
      environment: 'prod',
   },
   owner: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'boss@antigravity.ia',
      socialLinks: {
         twitter: 'https://twitter.com/antigravity',
         github: 'https://github.com/google-deepmind',
      },
   },
   team: [
      { username: 'jccallo', role: 'admin', active: 'true' }, // 'true' será convertido a booleano true
      { username: 'bot-1', active: 1 }, // 1 será convertido a booleano true, role tendrá default 'member'
   ],
   security: {
      authType: 'password',
      secret: 'super-secure-password-123',
      confirmSecret: 'super-secure-password-123',
   },
   extra_field: 'esto fallará en modo estricto',
}

// --- EJECUCIÓN ---
console.log('--- INICIANDO VALIDACIÓN COMPLEJA ---\n')

const result = v.validate(complexData, WorkspaceSchema, { strict: true })

if (result.success) {
   console.log('✅ ¡ÉXITO! Datos limpios y transformados:')
   console.log(JSON.stringify(result.data, null, 2))
} else {
   console.log('❌ ERRORES DE VALIDACIÓN:')
   console.log(JSON.stringify(result.errors, null, 2))
}

console.log('\n--- FIN DEL EJEMPLO ---')
