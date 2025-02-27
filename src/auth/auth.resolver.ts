import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { AuthInput, AuthOutput } from './inputs/auth.input'

@Resolver('Auth')
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => AuthOutput)
	async login(
		@Args('AuthInput') dto: AuthInput,
		@Context() context: { res: Response },
	) {
		const { refreshToken, accessToken, ...response } =
			await this.authService.login(dto)
		this.authService.addTokensToResponse(context.res, refreshToken, accessToken)

		return response
	}

	@Mutation(() => AuthOutput)
	async register(
		@Args('AuthInput') dto: AuthInput,
		@Context() context: { res: Response },
	) {
		const { refreshToken, accessToken, ...response } =
			await this.authService.register(dto)
		this.authService.addTokensToResponse(context.res, refreshToken, accessToken)

		return response
	}

	@Mutation(() => Boolean)
	async logout(@Context() context: { res: Response }) {
		this.authService.removeRefreshTokenFromResponse(context.res)
		return true
	}
}
