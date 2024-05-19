import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

// postgresql://docker:docker@localhost:5432/apisolid?schema=public

// Conexao com o banco
const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurada.')

	const url = new URL(process.env.DATABASE_URL)
	url.searchParams.set('schema', schema)

	return url.toString()
}

export default <Environment> <unknown>{
	name: 'prisma',
	async setup() {
		const schema = randomUUID()
		const databaseURL = generateDatabaseURL(schema)

		process.env.DATABASE_URL = databaseURL

		// Usa o deploy para não ficar verificando se á diferença e ja execulta tudo
		execSync('npx prisma migrate deploy')

		return {
			async teardown() { 
				await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
				await prisma.$disconnect()
			} 
		}
	},

	transformMode: 'ssr'
}