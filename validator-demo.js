import {
   validate,
   string,
   number,
   boolean,
   date,
   oneOf,
   optional,
   uuid,
} from './src/shared/infrastructure/validation/validator.js'

// 1. Definimos el esquema (Todo es obligatorio por defecto)
const userSchema = {
   // Strings con transformaciones y reglas de formato
   username: string('Nombre de usuario inválido')
      .trim()
      .toLowerCase()
      .min(3, 'Mínimo 3 caracteres')
      .max(20, 'Máximo 20 caracteres'),

   email: string('Email es obligatorio').trim().email('Formato de email incorrecto'),

   // Números con validación de valor
   age: number('La edad debe ser un número')
      .integer('Debe ser un número entero')
      .minValue(18, 'Debes ser mayor de edad'),

   // Enums y tipos básicos
   role: oneOf(['admin', 'user', 'guest'], 'Rol no permitido'),

   active: boolean('Debe ser un valor booleano'),

   // Campos opcionales
   website: optional().url('URL inválida'),

   // Fechas y Refinamientos personalizados
   signUpDate: date('Fecha de registro inválida'),

   // Refine: Regla personalizada lógica
   referralCode: optional()
      .string('Referencia inválida')
      .refine((val) => val.startsWith('REF-'), 'El código debe empezar con REF-'),
}

// 2. Datos que vienen del "frontend" (con algunas inconsistencias típicas)
const inputData = {
   username: '  JuanPerez  ', // Tiene espacios y mayúsculas
   email: 'JUAN@GMAIL.COM', // Mayúsculas
   age: '25', // Viene como string
   role: 'admin',
   active: '1', // Coerción de "1" a true
   website: 'https://miweb.com',
   signUpDate: '2024-05-20T10:00:00Z',
   referralCode: 'REF-999',
}

// 3. Ejecutamos la validación
const result = validate(inputData, userSchema)

// 4. Resultado
if (result.success) {
   console.log('✅ Validación exitosa')
   console.log('Dato transformado:', result.data)
   /* 
     Observa como result.data tiene:
     - username: "juanperez" (limpio y lowecase)
     - email: "juan@gmail.com" (lowercase)
     - age: 25 (ahora es Number real)
     - active: true (ahora es Boolean real)
     - signUpDate: Date Object (instancia de Date)
   */
} else {
   console.log('❌ Errores encontrados:')
   console.log(result.errors)
}
