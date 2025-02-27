import { ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'

export function getGraphqlConfig(): ApolloDriverConfig {
  return {
    playground: true,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    path: 'graphql',
    sortSchema: true,
    context: ({ req, res }) => ({ req, res }),
  };
}