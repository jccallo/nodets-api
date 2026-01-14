import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
   try {
      const exists = await knex.schema.hasTable('POSTS')

      if (exists) {
         console.log("Table 'POSTS' already exists. Skipping creation.")
         return
      }

      await knex.schema.createTable('POSTS', (table) => {
         table.integer('ID').primary()
         table.string('TITLE', 255).notNullable()
         table.string('CONTENT', 1000).notNullable()

         // Foreign Key
         table.integer('USER_ID').notNullable().references('ID').inTable('USERS').onDelete('CASCADE')

         table.timestamp('CREATED_AT').defaultTo(knex.fn.now())
         table.timestamp('UPDATED_AT').defaultTo(knex.fn.now())
      })

      // Create Generator (Sequence)
      await knex.raw('CREATE SEQUENCE GEN_POSTS_ID')

      // Create Trigger for Autoincrement
      await knex.raw(`
         CREATE TRIGGER TRI_POSTS_ID FOR POSTS
         ACTIVE BEFORE INSERT POSITION 0
         AS
         BEGIN
            IF (NEW.ID IS NULL) THEN
               NEW.ID = GEN_ID(GEN_POSTS_ID, 1);
         END
      `)
   } catch (error: any) {
      if (
         error.message.includes('already exists') ||
         error.message.includes('already defined') ||
         (error.gdscode && error.gdscode === 335544351)
      ) {
         console.log("Table 'POSTS' or artifacts already exist. Skipping.")
      } else {
         throw error
      }
   }
}

export async function down(knex: Knex): Promise<void> {
   try {
      await knex.schema.dropTable('POSTS')
      await knex.raw('DROP SEQUENCE GEN_POSTS_ID')
   } catch (e: any) {
      // Ignore
   }
}
