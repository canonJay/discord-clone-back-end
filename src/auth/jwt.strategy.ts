import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private usersService: UsersService,
		private authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => req.cookies[this.authService.ACCESS_TOKEN_NAME],
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

	async validate({ id }: { id: string }) {
		return this.usersService.findById(id)
	}
}
