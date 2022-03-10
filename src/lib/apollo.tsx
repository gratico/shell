import { createClient, Exchange } from 'urql'

export function getGraphQLClient(
  url: string,
  exchanges: Exchange[],
  suspense?: boolean,
  initialState?: Record<string, unknown>,
  fetchOptions?: Record<string, unknown>
) {
  return createClient({
    url,
    exchanges: [...exchanges],
    suspense,
    fetchOptions
  })
}
