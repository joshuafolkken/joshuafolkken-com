# Writing a blog post

The standards every post under `src/lib/posts/` is written to, and why each number is what it is.
This file is the single source: Issues link here instead of restating it, and
`src/lib/utils/post-standards.ts` enforces the half of it that a machine can check.

## How length is measured

Length is **never** file character count. It is `content_length.measure`
(`src/lib/utils/content-length.ts`): CJK characters plus Latin word tokens, counted after the
frontmatter, code fences, inline code, images and URLs have been stripped.

That distinction decides how a draft is judged. Across the hand-written posts the ratio of measured
length to file characters runs from **0.50** (`like-button.md`, code-heavy) to **0.71**
(`ai-chat.md`, prose-heavy) — nearly double. A post carrying screenshots and code blocks can be
6,000 characters on disk and still measure 3,000.

**Never estimate progress from file size.** Measure the draft.

## Targets

|                                                   | Value     |
| ------------------------------------------------- | --------- |
| Hard floor (ads suppressed, `noindex` below this) | **1,200** |
| Floor for a new post                              | **2,600** |
| Target for a new post                             | **3,000** |

`1,200` is not a writing target — it is the runtime cutoff in
`src/lib/utils/content-quality.ts`, below which a post serves no ads and is excluded from indexing
and the sitemap.

### Why 2,600 is the floor

The site-wide median is what Google's content-quality review reacts to; its judgement is about the
site, not the page (see #607 and #833). At the time this policy was written the median across 36
posts was 2,403 (2,392 across the 23 hand-written ones).

A batch of new posts moves that median directly. For the 13-post series in #883, which is 36% of the
corpus:

| The batch is written at | Resulting site-wide median |
| ----------------------- | -------------------------- |
| 2,200                   | 2,200 — lower than today   |
| 2,600                   | 2,600                      |
| 3,000                   | 2,659                      |
| 3,400                   | 2,659 — no further gain    |

2,600 is the turning point: below it the median falls, above roughly 2,700 the median stops
improving. So **2,600 is where site quality is bought most cheaply, and everything above it is
bought for the reader instead**.

### Why 3,000 is the target

`kit-2.md` measures 3,267 and `kit-package.md` 4,084. Readers arriving at a sequel expect the
thickness of the post that brought them. 3,000 matches that without the 10,675 of `mnemecha.md`.

## Shape

**One post answers one question.** Not one feature, one question — "what went wrong and how it was
decided", never "what was built". A post that surveys several features explains all of them and
lands none.

Every post carries **one failure, one decision, one number**. The failure is the part readers stay
for: `kit-package.md` and `kit-2.md` are read because they record what did not work, not because
they announce a result.

A rough allocation for a 3,000-measure post:

| Section                       | Measured |
| ----------------------------- | -------- |
| Opening / thanks              | 150      |
| What was going wrong          | 500      |
| What was tried and failed     | 1,000    |
| How it was decided            | 850      |
| What changed, with one number | 350      |
| Close                         | 150      |

The largest block is the failure. When a draft runs short, that is the section to grow — never the
feature description.

## Required frontmatter

```yaml
---
title: '...'
date: 'YYYY-MM-DD HH:mm'
author: 'Joshua Folkken'
cover_image: /api/images/blog/<name>.webp
excerpt: '...'
---
```

`title`, `date` and `excerpt` are load-bearing: `blog_parser.parse_post` drops a post missing any of
them, so it disappears from the blog list entirely rather than appearing incomplete.

`cover_image` may reuse an existing image under `src/lib/assets/images/blog/`. A video-derived post
may omit it and carry `youtube:` instead — the card image is taken from the video still (#821).

`tags:` appears in 16 of the 36 posts and **nothing reads it**. The `Post` type has no tags field,
and the related-posts section ranks candidates by full text through MiniSearch
(`src/lib/utils/related-posts.ts`), not by tag overlap. Adding tags to a post changes nothing today;
do not add them expecting an effect.

## Workflow

1. Draft in `prompts/blog-drafts/`.
2. Publish to `src/lib/posts/<slug>.md`. **There is no draft flag** — every file in that directory
   is live once deployed.
3. Run `pnpm josh test:unit`. `post-standards.test.ts` measures every post and fails when a new one
   misses the floor, has no `author`, or has no card image source.

Posts that predate this policy are listed in `GRANDFATHERED_SLUGS`
(`src/lib/utils/post-standards.ts`). That list is the remaining backlog from #833, not a place to
add new work: a new post that cannot meet the floor is a post that needs more writing.

## Talk posts

`talk-*` posts are generated from YouTube recordings by a separate pipeline — see
[blog-from-youtube.md](./blog-from-youtube.md). They are held to the same floor: the two posts
currently below 1,200 are both talk-derived, and both are excluded from indexing because of it.
