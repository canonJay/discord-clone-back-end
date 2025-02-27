import { Query, Resolver } from '@nestjs/graphql'
import { UserInput } from './inputs/user-input'
import { UsersService } from './users.service'

@Resolver('User')
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Query(() => [UserInput], { name: 'findMany' })
	getAllUsers() {
		return this.usersService.findMany()
	}
}
