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

A draft is not something a person writes and drops into `prompts/blog-drafts/` for an agent to
polish. **The drafting starts with questions**, and the draft is written from the answers.

What makes these posts worth reading is not the result — it is the process: what was infuriating,
what nearly got abandoned, what settled the decision. None of that survives in the Issue, the commit
log or the diff a post is built from. It exists only in the author's head, and asking is the only
way it reaches the draft.

**Two of the steps below end in a stop, and neither is optional.** A person picks the cover image
(step 6), and a person decides whether the post goes out (step 10). Neither is a judgement any test
in this repository makes: `post-standards.test.ts` reads length and checks that the required
frontmatter is present, and nothing judges _which_ image was picked, how the excerpt reads, or what
the first screen looks like. An unattended run that walks past them publishes a post nobody read. At
each stop, send a `confirmation` Telegram before stopping, per `CLAUDE.md` → "Mid-workflow stop
notification":

```bash
pnpm josh notify --task-type confirmation --issue-url "<issue-url>" --body=$'<one-line reason>\n<what is needed from the user>'
```

Because these stops exist, **a post is run with `halfrun #N`, one post at a time.** `queue` and
`epicrun` run to an automatic merge and would carry a post past both of them.

### 1. Ask, one post at a time — 5 to 7 questions

**Ask immediately before writing that one post, about that one post.** Never batch the questions for
a whole series: what is worth asking differs per post, and answers given thirteen posts at a time
come back thinner per post than answers given once.

The questions are asked in Japanese, because the author answers in Japanese and the post is written
in Japanese. The phrasing below is meant to be used as it stands.

> 1. この作業を始める前、何に一番苛立っていましたか
> 2. 途中で「もう駄目かもしれない」と思った瞬間はありましたか。何が起きたときですか
> 3. 最終的にこの形に決めた決め手は何ですか。かわりに何を捨てましたか
> 4. やってみて意外だったことは何ですか
> 5. 終わったあと、日々の作業で何が変わりましたか
> 6. ひとつだけ数字を挙げるとしたら何ですか（時間・回数・件数など）
> 7. 同じことを読者がやるとしたら、どこで転ぶと思いますか

Questions 2 and 3 feed **What was tried and failed** and **How it was decided** — 1,850 of the 3,000
in the allocation above, and the largest block in every post. When those answers are thin there is
nothing left to grow, and the draft gets padded with feature description instead.

### 2. Leave the gaps as gaps

**Never invent the parts the answers did not cover.** Where an emotion, a motive or a turning point
was not given, leave the passage blank in the draft, say which passages are blank, and get them
confirmed before publishing.

Two reasons, each sufficient. `kit-package.md` and `kit-2.md` are read because the failures in them
actually happened, and a plausible invented failure does not read the same way. And a post is
published as the author's own experience, so an invented account is indistinguishable from a real
one to every reader — nobody outside is in a position to correct it.

### 3. Draft in `prompts/blog-drafts/`

Write the failure first, following the allocation in **Shape**. The feature description is the last
thing to write and the first thing to cut.

### 4. Measure, then adjust

**File size is not length** (see **How length is measured**). To measure a draft where it sits:

```bash
pnpm exec tsx -e "import {readFileSync} from 'node:fs';import {content_length} from './src/lib/utils/content-length.ts';console.log(content_length.measure(readFileSync(process.argv[1],'utf8')))" prompts/blog-drafts/<name>.md
```

Short of 2,600, grow **What was tried and failed** — never the feature description. Aim for 3,000.

### 5. Build the cover-image candidates and the page that compares them

```bash
pnpm blog:cover <slug> [count]                     # generated -> .covers/<slug>/ (git-ignored)
pnpm blog:cover:stock <slug> [count] [keywords]    # free photos -> .covers/<slug>/ + a manifest
pnpm blog:cover:review <manifest.json>             # -> .covers/<slug>/review.html
```

There are two ways to fill `.covers/<slug>/`, and `blog:cover:review` renders either — generated
files and free-photo URLs alike — into one ranked page. None of the three writes to
`src/lib/assets/images/blog/`: the adopted candidate is copied there by hand, so no candidate
reaches the repository on a script run alone.

**Use `blog:cover:stock`.** It searches Openverse, which needs no key and no account, downloads five
candidates by default, and writes `.covers/<slug>/<stamp>-stock.json` — a manifest `blog:cover:review`
opens untouched, with the credit line and license URL of every candidate filled in from the API. The
keywords default to the post's `title`, which only finds anything for an English title: pass them
explicitly otherwise, and pass the count first when passing both.

**`blog:cover` has not yet produced an image from this repository.** Gemini's image models have no
free tier at all, and the key in `.env` answers `429 RESOURCE_EXHAUSTED` with `limit: 0` on the very
first request because its project has no billing enabled. Until that is fixed, `blog:cover:stock` is
the route that works.

**A hand-written manifest is still accepted**, and is what ranks a set the scripts did not collect.
It is the ranking — which candidate is first, and why — so it is the judgement the review page
exists to record; `blog:cover:stock` seeds that ranking with the search's own order, for a person to
re-order. The schema, with a filled-in example, is the header comment of
`scripts/blog-cover-review.ts`.

### 6. Stop — a person picks the cover image

**Hand over the comparison page and stop. Never adopt a candidate on your own**, and never treat
rank 1 in the manifest as the decision: the ranking is the case being put, not the verdict. Send the
`confirmation` Telegram, say where the page is, and wait.

The page is one self-contained HTML file, so it can be opened locally or published as an Artifact
and handed over as a link. Once the answer comes back, copy that one candidate into
`src/lib/assets/images/blog/` under the post's own name, keeping its source extension.

**`cover_image` never names that file.** It is always `/api/images/blog/<name>.webp`, whatever the
source is — `kit-2.jpg` on disk is `cover_image: /api/images/blog/kit-2.webp` in the post.

**What actually resolves the value is its basename alone.** `src/lib/data/blog-images.ts` strips the
directory and the extension off `cover_image` and looks for a file of that basename in
`src/lib/assets/images/blog/`, so `<name>` is the only part that has to be right — and the file it
finds has to be a `jpg`, `jpeg` or `png`, because those are the extensions its glob reads. A `.webp`
placed in that directory is not picked up. On no match the raw string is served, which 404s and
renders a blank card; `post-standards.test.ts` fails on exactly that, naming the post, the value and
the reason. It also fails on a value the parser throws away before the page is built — one not
starting with `/`, or holding a `//` — which renders no cover at all.

### 7. Put the post in `src/lib/posts/<slug>.md`

**There is no draft flag** — every file in that directory is live once deployed, which is why the
stop in step 10 comes before the deployment rather than after it.

### 8. Run `pnpm josh test:unit`

`post-standards.test.ts` measures every post and fails when a new one misses the floor, has no
`author`, or has no card image source. It also checks that every `cover_image` resolves to a file in
`src/lib/assets/images/blog/`, and compares the files on disk to the parsed posts, which is what
catches a missing `title`, `date` or `excerpt`. Nothing in it judges the writing.

### 9. Capture the page a reader would land on

```bash
pnpm josh-app shot /blog/<slug>
```

The route has to be absolute. The cover image, the excerpt and whatever fills the first screen are
what a reader meets first, and nothing in the suite looks at whether any of them came out right.

### 10. Stop — a person decides whether it goes out

**Hand over the screenshot and stop.** Send the `confirmation` Telegram and wait for the answer;
publication is not a step you take on a green gate. Everything a machine can check has passed by
this point, and none of it is the question being asked — whether the post is worth reading, and
whether the page looks right, are both answered by looking.

Blank passages left by step 2 are confirmed here too, if they have not been confirmed already. A
post still carrying one is not ready to go out.

Posts that predate this policy are listed in `GRANDFATHERED_SLUGS`
(`src/lib/utils/post-standards.ts`). That list is the remaining backlog from #833, not a place to
add new work: a new post that cannot meet the floor is a post that needs more writing.

## Talk posts

`talk-*` posts are generated from YouTube recordings by a separate pipeline — see
[blog-from-youtube.md](./blog-from-youtube.md). They are held to the same floor: the two posts
currently below 1,200 are both talk-derived, and both are excluded from indexing because of it.
