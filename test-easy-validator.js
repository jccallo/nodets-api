const { string, validate, nullable, optional } = require('./src/shared/infrastructure/validation/easy-validator.js')

const schema = {
   name: string().min(3).max(10),
   role: string().inList(['Admin', 'Moderator']),
   bio: string().includes('node'),
   website: string().optional().includes('http'),
   deletedAt: optional().nullable().string(),
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
      verify: (data) => !('deletedAt' in data),
   },
]

console.log('--- STARTING EASY-VALIDATOR TESTS ---\n')

testCases.forEach((tc) => {
   const result = validate(tc.data, schema)
   let passed = result.success === tc.expectSuccess

   if (passed && tc.expectSuccess && tc.verify) {
      if (!tc.verify(result.data)) passed = false
   }

   if (passed) {
      console.log(`✅ PASSED: ${tc.name}`)
   } else {
      console.log(`❌ FAILED: ${tc.name}`)
      console.log('Result:', JSON.stringify(result, null, 2))
   }
})

console.log('\n--- TESTS FINISHED ---')
