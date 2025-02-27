import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { UserInput } from 'src/users/inputs/user-input'

@InputType()
export class AuthInput {
	@Field(() => String, { nullable: true })
	username?: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string
}

@ObjectType()
export class AuthOutput {
	@Field(() => UserInput)
	user: UserInput
}
