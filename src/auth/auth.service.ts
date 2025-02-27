import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { UsersService } from 'src/users/users.service'
import { AuthInput } from './inputs/auth.input'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 20
	EXPIRE_DAY_ACCESS_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'
	ACCESS_TOKEN_NAME = 'accessToken'

	constructor(
		private readonly usersService: UsersService,
		private readonly jwt: JwtService,
	) {}

	async register(dto: AuthInput) {
		const oldUser = await this.usersService.findByEmail(dto.email)

		if (oldUser) throw new BadRequestException('User already exists')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.usersService.create(
			dto.username,
			dto.email,
			dto.password,
		)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens,
		}
	}

	async login(dto: AuthInput) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens,
		}
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1d',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '20d',
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthInput) {
		const user = await this.usersService.findByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new BadRequestException('Invalid password')

		return user
	}

	addTokensToResponse(
		res: Response,
		refreshToken: string,
		accessToken: string,
	) {
		const expiresInRefresh = new Date()
		expiresInRefresh.setDate(
			expiresInRefresh.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN,
		)

		const expiresInAccess = new Date()
		expiresInAccess.setDate(
			expiresInAccess.getDate() + this.EXPIRE_DAY_ACCESS_TOKEN,
		)

		res.cookie(this.ACCESS_TOKEN_NAME, accessToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresInAccess,
			secure: true,
			// lax if production
			sameSite: 'none',
		})

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresInRefresh,
			secure: true,
			// lax if production
			sameSite: 'none',
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.ACCESS_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			// lax if production
			sameSite: 'none',
		})

		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			secure: true,
			// lax if production
			sameSite: 'none',
		})
	}
}
