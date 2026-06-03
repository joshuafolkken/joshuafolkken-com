import { OPENCOLLECTIVE } from '$lib/app'
import { CONTENT_TYPE, ERROR_MESSAGES, HTTP_HEADERS } from '$lib/constants/http'
import type {
	GraphqlContributor,
	GraphqlResponse,
	OpenCollectiveMember,
} from '$lib/types/opencollective'

const GRAPHQL_ENDPOINT = 'https://api.opencollective.com/graphql/v2'
const CONTRIBUTORS_LIMIT = 100
const OPENCOLLECTIVE_BASE_URL = new URL(OPENCOLLECTIVE.URL).origin

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

function is_valid_contributor(
	node: GraphqlContributor,
): node is GraphqlContributor & { account: NonNullable<GraphqlContributor['account']> } {
	return node.isBacker && node.totalAmountContributed.value > 0 && Boolean(node.account)
}

function map_contributors_to_supporters(
	nodes: Array<GraphqlContributor>,
): Array<OpenCollectiveMember> {
	const filtered = nodes.filter((node) => is_valid_contributor(node))

	return filtered
		.map((node) => {
			return {
				MemberId: Number.parseInt(node.id, 10),
				name: node.account.name,
				image: node.account.imageUrl,
				profile: `${OPENCOLLECTIVE_BASE_URL}/${node.account.slug}`,
				totalAmountDonated: node.totalAmountContributed.value,
				role: 'BACKER',
			}
		})
		.toSorted((first, second) => second.totalAmountDonated - first.totalAmountDonated)
}

function is_graphql_response(value: unknown): value is GraphqlResponse {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function throw_if_graphql_errors(response: GraphqlResponse): void {
	const { errors } = response

	if (errors?.length) {
		const message = errors[0]?.message ?? 'GraphQL error'
		throw new Error(message)
	}
}

function get_contributor_nodes(response: GraphqlResponse): Array<GraphqlContributor> {
	const nodes = response.data?.account?.contributors?.nodes

	return nodes ?? []
}

function parse_graphql_response(json: unknown): Array<GraphqlContributor> {
	if (!is_graphql_response(json)) {
		throw new Error('Invalid GraphQL response format')
	}

	throw_if_graphql_errors(json)

	return get_contributor_nodes(json)
}

async function fetch_supporters(
	fetch_function: typeof globalThis.fetch,
): Promise<Array<OpenCollectiveMember>> {
	const response = await fetch_function(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON },
		body: JSON.stringify({
			query: CONTRIBUTORS_QUERY,
			variables: { slug: OPENCOLLECTIVE.SLUG, limit: CONTRIBUTORS_LIMIT },
		}),
	})

	if (!response.ok) throw new Error(ERROR_MESSAGES.FAILED_TO_FETCH_CONTRIBUTORS)

	const json: unknown = await response.json()
	const nodes = parse_graphql_response(json)

	return map_contributors_to_supporters(nodes)
}

export const opencollective_api = {
	fetch_supporters,
}
