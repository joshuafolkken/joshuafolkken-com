/**
 * Resolve a blog post from a slug or a path, and read the fields the cover scripts work from.
 *
 * Both cover commands start from the same post: `blog-cover-image` turns it into a generation
 * prompt, `blog-cover-stock` turns it into search keywords. The resolution rules are identical —
 * a bare slug means `src/lib/posts/<slug>.md`, an explicit `.md` path is taken as given, and a
 * post with no `title` is refused because the blog itself would drop it — so they are read from
 * here rather than written twice.
 *
 * The frontmatter is parsed by `blog-frontmatter`, which uses the same YAML rules the site does.
 */
import path from 'node:path'
import { blog_frontmatter } from './blog-frontmatter'

const POSTS_DIR = 'src/lib/posts'
const MARKDOWN_EXTENSION = '.md'

interface PostSummary {
	slug: string
	title: string
	excerpt: string
	body: string
}

// Accepts either a slug or a path so a command reads the same whether it is typed by hand or
// completed from the posts directory.
function resolve_post_path(slug_or_path: string): string {
	if (slug_or_path.endsWith(MARKDOWN_EXTENSION)) return slug_or_path

	return path.join(POSTS_DIR, `${slug_or_path}${MARKDOWN_EXTENSION}`)
}

function resolve_slug(post_path: string): string {
	return path.basename(post_path, MARKDOWN_EXTENSION)
}

// A post with no `title` is one the blog itself would drop (see `blog_parser.parse_post`), so it
// fails here rather than letting an untitled post reach a prompt or a search query. Takes the path
// rather than the slug so both failures name the file that was actually read: a draft outside
// `POSTS_DIR` has a basename that resolves to a different post, and reporting the basename alone
// would point at the wrong one.
function read_summary(post_path: string, markdown: string, body_limit: number): PostSummary {
	const { frontmatter, body } = blog_frontmatter.split_frontmatter(markdown)
	const document = blog_frontmatter.parse_frontmatter(frontmatter, post_path)
	const title = blog_frontmatter.read_field(document, 'title')

	if (title === undefined || title === '') {
		throw new Error(`No \`title\` in the frontmatter of ${post_path}`)
	}

	return {
		slug: resolve_slug(post_path),
		title,
		excerpt: blog_frontmatter.read_field(document, 'excerpt') ?? '',
		body: body.slice(0, body_limit),
	}
}

const blog_post_source = {
	POSTS_DIR,
	resolve_post_path,
	resolve_slug,
	read_summary,
}

export type { PostSummary }
export { blog_post_source }
