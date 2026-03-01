import { OPENCOLLECTIVE } from '$lib/app'
import type {
	GraphqlContributor,
	GraphqlResponse,
	OpenCollectiveMember,
} from '$lib/types/opencollective'

const GRAPHQL_ENDPOINT = 'https://api.opencollective.com/graphql/v2'
const CONTRIBUTORS_LIMIT = 100
const OPENCOLLECTIVE_BASE_URL = 'https://opencollective.com'

const CONTRIBUTORS_QUERY = `
  query Contributors($slug: String!, $limit: Int!) {
    account(slug: $slug) {
      ... on AccountWithContributions {
        contributors(limit: $limit) {
          nodes {
            id
            totalAmountContributed {
              value
            }
            account {
              name
              slug
              imageUrl
            }
            isBacker
          }
        }
      }
    }
  }
`

function map_contributors_to_supporters(
	nodes: Array<GraphqlContributor>,
): Array<OpenCollectiveMember> {
	const filtered = nodes.filter(
		(node): node is GraphqlContributor & { account: NonNullable<GraphqlContributor['account']> } =>
			node.isBacker && node.totalAmountContributed.value > 0 && node.account !== null,
	)

	return filtered
		.map((node) => {
			/* eslint-disable @typescript-eslint/naming-convention -- OpenCollectiveMember API contract */
			return {
				MemberId: Number.parseInt(node.id, 10),
				name: node.account.name,
				image: node.account.imageUrl,
				profile: `${OPENCOLLECTIVE_BASE_URL}/${node.account.slug}`,
				totalAmountDonated: node.totalAmountContributed.value,
				role: 'BACKER',
			}
			/* eslint-enable @typescript-eslint/naming-convention */
		})
		.toSorted((first, second) => second.totalAmountDonated - first.totalAmountDonated)
}

function throw_if_graphql_errors(response: GraphqlResponse): void {
	const { errors } = response

	if (errors !== undefined && errors.length > 0) {
		const message = errors[0]?.message ?? 'GraphQL error'
		throw new Error(message)
	}
}

function parse_graphql_response(json: unknown): Array<GraphqlContributor> {
	const response = json as GraphqlResponse
	throw_if_graphql_errors(response)
	return response.data?.account?.contributors?.nodes ?? []
}

async function fetch_supporters(
	fetch_function: typeof globalThis.fetch,
): Promise<Array<OpenCollectiveMember>> {
	const response = await fetch_function(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: CONTRIBUTORS_QUERY,
			variables: { slug: OPENCOLLECTIVE.SLUG, limit: CONTRIBUTORS_LIMIT },
		}),
	})

	if (!response.ok) throw new Error('Failed to fetch contributors')

	const json: unknown = await response.json()
	const nodes = parse_graphql_response(json)
	return map_contributors_to_supporters(nodes)
}

export const opencollective_api = {
	fetch_supporters,
}
