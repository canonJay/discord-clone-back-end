import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

import * as express from 'express'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(express.json())

	app.use(cookieParser())
	app.enableCors({
		origin: ['http://localhost:3000'],
		credentials: true,
		exposedHeaders: 'set-cookie',
	})

	await app.listen(process.env.PORT ?? 4200)
}
bootstrap()
