import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable('posts', (table) => {
      table.bigIncrements('id').primary()
      table.string('title').notNullable()
      table.text('content').notNullable()
      table.boolean('published').defaultTo(false)
      table.bigInteger('userId').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('createdAt').defaultTo(knex.fn.now())
   })
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable('posts')
}
