import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserInput {
	@Field(() => ID)
	id: string

	@Field(() => String)
	username: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => String)
	createdAt: string

	@Field(() => String)
	updateAt: string

	@Field(() => String, { nullable: true })
	displayName?: string

	@Field(() => String, { nullable: true })
	avatar?: string
}
