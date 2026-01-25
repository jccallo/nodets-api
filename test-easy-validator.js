const {
   string,
   validate,
   nullable,
   optional,
   array,
   required,
} = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schema = {
   name: required('Nombre es súper obligatorio').string().min(3).max(10),
   role: string().required('Rol es obligatorio').inList(['Admin', 'Moderator']),
   bio: string().includes('node'),
   website: string().optional().includes('http'),
   deletedAt: optional().nullable().string(),
   tags: optional().array().minLength(2).maxLength(5).includes('javascript'),
}

const testCases = [
   {
      name: 'Case 1: Full Success (Case Insensitive)',
      data: {
         name: 'Carlos',
         role: 'admin', // lowercase should match 'Admin'
         bio: 'I love NODE.js', // uppercase 'NODE' should match 'node'
      },
      expectSuccess: true,
   },
   {
      name: 'Case 2: Fail min/max',
      data: {
         name: 'Jo', // too short
         role: 'Admin',
         bio: 'node developer',
      },
      expectSuccess: false,
   },
   {
      name: 'Case 3: Fail inList and includes',
      data: {
         name: 'ValidName',
         role: 'Guest', // not in list
         bio: 'java developer', // doesn't include 'node'
      },
      expectSuccess: false,
   },
   {
      name: 'Case 4: Required failure (empty fields)',
      data: {
         name: '',
         role: '',
         bio: '',
      },
      expectSuccess: false,
   },
   {
      name: 'Case 5: Exclusion of empty strings in optional fields',
      data: {
         name: 'Carlos',
         role: 'admin',
         bio: 'node fan',
         website: '', // empty string in optional
      },
      expectSuccess: true,
      verify: (data) => !('website' in data),
   },
   {
      name: 'Case 6: Exclusion of null/missing in optional fields',
      data: {
         name: 'Carlos',
         role: 'admin',
         bio: 'node fan',
         website: null, // null in optional
      },
      expectSuccess: true,
      verify: (data) => !('website' in data),
   },
   {
      name: 'Case 7: Inclusion of null in nullable fields',
      data: {
         name: 'Carlos',
         role: 'admin',
         bio: 'node fan',
         deletedAt: null, // should STAY as null because of .nullable()
      },
      expectSuccess: true,
      verify: (data) => data.deletedAt === null && 'deletedAt' in data,
   },
   {
      name: 'Case 8: Nullable + Optional and NOT provided (should BE EXCLUDED)',
      data: {
         name: 'Carlos',
         role: 'admin',
         bio: 'node fan',
         // deletedAt is missing, and it is optional
      },
      expectSuccess: true,
      verify: (data) => !('deletedAt' in data) && !('tags' in data),
   },
   {
      name: 'Case 9: Array success (case insensitive includes)',
      data: {
         name: 'Carlos',
         role: 'admin',
         bio: 'node fan',
         tags: ['Node', 'JAVASCRIPT', 'Web'], // matches 'javascript'
      },
      expectSuccess: true,
   },
   {
      name: 'Case 10: Array failure (too short or missing include)',
      data: {
         name: 'Carlos',
         role: 'admin',
         bio: 'node fan',
         tags: ['PHP'], // too short and doesn't include javascript
      },
      expectSuccess: false,
   },
   {
      name: 'Case 11: Custom required message',
      data: {
         name: '', // Empty name for required failure
         role: 'Admin',
         bio: 'node fan',
      },
      expectSuccess: false,
      verify: (errors) => errors.name.includes('Nombre es súper obligatorio'),
   },
   {
      name: 'Case 12: Custom required message AT THE END',
      data: {
         name: 'Carlos',
         role: '', // Empty role for required failure
         bio: 'node fan',
      },
      expectSuccess: false,
      verify: (errors) => errors.role.includes('Rol es obligatorio'),
   },
]

console.log('--- STARTING EASY-VALIDATOR TESTS ---\n')

testCases.forEach((tc) => {
   const result = validate(tc.data, schema)
   let passed = result.success === tc.expectSuccess

   if (passed && tc.verify) {
      const param = tc.expectSuccess ? result.data : result.errors
      if (!tc.verify(param)) passed = false
   }

   if (passed) {
      console.log(`✅ PASSED: ${tc.name}`)
   } else {
      console.log(`❌ FAILED: ${tc.name}`)
      console.log('Result:', JSON.stringify(result, null, 2))
   }
})

console.log('\n--- TESTS FINISHED ---')
