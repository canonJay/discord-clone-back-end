import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string) {
		return this.prisma.user.findUnique({ where: { id } })
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } })
	}

	async create(username: string, email: string, password: string) {
		const user = this.prisma.user.create({
			data: {
				username,
				email,
				password: await hash(password),
			},
		})

		return user
	}

	async findMany() {
		return this.prisma.user.findMany()
	}

	async delete(id: string) {
		return this.prisma.user.delete({ where: { id } })
	}
}
