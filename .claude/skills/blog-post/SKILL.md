---
name: blog-post
description: Apply this project's blog standards whenever a post under `src/lib/posts/` or a draft under `prompts/blog-drafts/` is being written, expanded, reviewed or judged — including work on any Issue whose deliverable is a published post. It carries the length floor and how length is actually measured (code and images do not count), the required frontmatter, and the one-question shape a post is built around. It also carries the two points where the workflow stops for a person to decide — which cover image, and whether the post goes out. Use it before drafting and again before calling a post done; do not estimate a draft's length from its file size without it.
---

# Blog post standards

The standards live in [docs/blog-writing.md](../../../docs/blog-writing.md). **Read that file
first** — this skill exists to make sure it is read, not to restate it. What follows is only what
decides whether you need it.

## Use this when

- Writing or expanding a post in `src/lib/posts/`, or a draft in `prompts/blog-drafts/`
- Working an Issue whose deliverable is a published post (the series under epic #883, for example)
- Judging whether a draft is long enough, or reviewing one before publishing

## Drafting does not start at the draft

**It starts by interviewing the author**, and nothing in the emotional half of a post is written
without an answer to draw on. Both rules live in the Workflow section of the canon, along with the
question wording, the measuring step, the cover-image commands and the preview. Read that section
before drafting rather than working from this paragraph.

## Two steps are not yours to take

**A person picks the cover image, and a person decides whether the post goes out.** The workflow
stops at both: hand over the comparison page, hand over the screenshot, send a `confirmation`
Telegram per `CLAUDE.md` → "Mid-workflow stop notification", and wait for the answer. Nothing in
this repository tests a cover image, an excerpt or the first screen, so a run that walks past either
stop publishes a post nobody read — which is also why a post is run with `halfrun #N` rather than
`queue` or `epicrun`. They are steps 6 and 10 of the canon's Workflow section.

## The three things that are most often got wrong

1. **Length is not file size.** It is `content_length.measure` — CJK characters plus Latin word
   tokens, counted after frontmatter, code fences, inline code, images and URLs are stripped. The
   ratio between the two runs from 0.50 to 0.71 across existing posts, so a code-heavy draft can be
   6,000 characters on disk and still fall short. Measure the draft; never estimate from the file.
2. **The floor for a new post is 2,600, the target 3,000.** `1,200` is a different number — the
   runtime cutoff below which a post serves no ads and is dropped from indexing. Writing to 1,200 is
   not writing to standard. `docs/blog-writing.md` records why 2,600 is the floor.
3. **`title`, `date` and `excerpt` are load-bearing.** A post missing any of them is dropped by
   `blog_parser.parse_post` and never appears in the blog list at all. `author` and a card image
   source are required too — `cover_image`, or `youtube` for a video-derived post. `tags:` is not:
   nothing reads a post's tags, so adding them changes nothing.

## Checking a draft

`pnpm josh test:unit` runs `src/lib/utils/post-standards.test.ts`, which measures every post and
fails on one that misses the floor, has no `author`, has no card image source, carries a
`cover_image` that resolves to no file in `src/lib/assets/images/blog/`, or writes that `cover_image`
outside the single form `docs/blog-writing.md` declares. Posts predating the policy are
grandfathered in `src/lib/utils/post-standards.ts`; that list is backlog, not a place to add a new
post that came up short.
