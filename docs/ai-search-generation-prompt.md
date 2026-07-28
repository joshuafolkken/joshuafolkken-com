# AI Search generation system prompt

This file is the **repo source-of-record** for the generation system prompt used by the
Cloudflare AI Search (AutoRAG) instance `joshuafolkken-com-chat`, which powers the site
`/chat` assistant.

> **Where it is actually applied:** the prompt lives on the **Cloudflare dashboard**
> (AI Search instance → Generation → System prompt), which is the single source of truth at
> runtime. The dashboard is **not** version-controlled, so this file exists to keep an
> auditable copy. When the dashboard prompt changes, update this file in the same change.
>
> `src/lib/server/chat.ts` deliberately does **not** override the model, retrieval
> thresholds, or system prompt in code — doing so diverged production from the Playground in
> [#675](https://github.com/joshuafolkken/joshuafolkken-com/issues/675). `wrangler.jsonc`
> only declares the binding (`instance_name`), not generation config.

## Why this prompt

Each ingested document carries a header written by
[`scripts/github-documentation.ts`](../scripts/github-documentation.ts) →
`build_document_content`:

```text
# <repo> — <path>
Repository: <repo>
Description: <description>
Topics: <topics>
Source: https://github.com/<owner>/<repo>/blob/<branch>/<path>

---

<markdown body>
```

The real source URL is the `Source:` line. Before this prompt, the model cited the
**flattened index key** instead (e.g. `github__kit__docs__package.md`), producing two visible
defects:

1. Doubled underscores (`__`) in the citation text — the `build_document_key` path separators
   echoed verbatim.
2. A fabricated **relative** link that the browser resolved against the site origin →
   `https://joshuafolkken.com/github__kit__docs`, which is broken.

This prompt instructs the model to cite using the embedded `Source:` URL as a proper absolute
Markdown link, and never to emit the flattened index key or filename. It also preserves the
existing behaviors: answering in the user's language
([#675](https://github.com/joshuafolkken/joshuafolkken-com/issues/675)) and handling off-topic
questions in-band ([#665](https://github.com/joshuafolkken/joshuafolkken-com/issues/665)).

> **Note:** LLM compliance for exact URLs is not 100% reliable, so `src/lib/utils/markdown.ts` →
> `rewrite_citation` is the deterministic, code-side safety net. It covers every way a document's
> internal identity leaks into what the reader sees:
>
> 1. The flattened key is the **href** (a relative link) → rewrite the href into a real GitHub blob
>    URL on the default branch, and the label into `<path> — <repo>`.
> 2. The key is only the **label** of a link whose href is the accurate `Source:` URL
>    ([#788](https://github.com/joshuafolkken/joshuafolkken-com/issues/788)) → rewrite the label
>    alone.
> 3. The **H1 above** (`# <repo> — <path>`) is the label, with the model's own ` — <repo>` appended,
>    giving `<repo> — <path> — <repo>`
>    ([#794](https://github.com/joshuafolkken/joshuafolkken-com/issues/794)) → rebuild the label from
>    the href. Detection requires the label to open with the href's own repo, so a deliberate
>    descriptive label is never rewritten.
>
> Only case 1 touches the href. A label never determines a URL: the flattened key encodes no branch,
> so a best-effort `main` URL would clobber a correct non-`main` one.
>
> The clean label is built by `github_document_key.to_display_text`, which emits the same
> `<path> — <repo>` shape this prompt mandates, so a model-written and a rewritten citation read alike.
>
> Case 3 exists because the H1 and the citation convention share the `—` separator, which invites
> the model to treat the H1 as the "page title" the site-page rule asks for. The prompt rule below
> ("never use the document's own H1 heading") is the primary guard; the renderer is the net.

## Link formatting ([#747](https://github.com/joshuafolkken/joshuafolkken-com/issues/747))

Three readability rules govern how links appear in answers. All are enforced at generation time
(the prompt) rather than by post-processing the response in the app — so the model localizes
the reference label to the answer's own language, and no code needs to parse or rewrite the
rendered link:

1. **Inline spacing.** Japanese has no ASCII word spaces, so a `[title](url)` renders flush
   against the surrounding text. The prompt asks the model to pad a link with a half-width
   (ASCII) space on each side.
2. **End placement.** All citations go together at the very end of the answer, after the
   explanation — never inline in a sentence and never leading the answer — so the long citation
   titles do not bury the actual answer. (Earlier the rule only moved a _leading_ link and left
   mid-sentence links in place, which scattered citations through the reply; they are now always
   collected at the end.)
3. **Single reference label.** The citation list is introduced by one language-localized label
   (`参考:` / `Reference:`) used once, with the links listed after it, rather than repeating the
   label before every link.

## Answer style and partial coverage

Two quality rules keep answers useful without loosening grounding:

1. **Partial coverage over refusal.** The earlier prompt said "answer only from the retrieved
   documents" and "if the documents do not contain the answer, say so" — which made the model
   refuse a whole question the moment one sub-part was missing (e.g. it explained `kit` and
   `game-kit` but dropped the entire reply because `app-kit` was not indexed). The prompt now
   asks it to answer what the documents DO support and note only the uncovered part, reserving
   "could not find it" for when nothing relevant is retrieved at all. Grounding is unchanged:
   outside knowledge and invented facts/URLs are still forbidden.
2. **Structure over prose.** For multi-point or comparison answers the model should use short
   headings and bullet lists rather than one flat paragraph, so replies stay scannable — the
   structured style the earlier prompt had regressed into a wall of prose.

## Applied prompt text

```text
You are the assistant for joshuafolkken.com, answering questions about Joshua Folkken, his
projects, and his documentation. Answer using the retrieved documents provided as context.

Language:
- Reply entirely in the same language as the user's question. If the question is in Japanese,
  answer in Japanese; if in English, answer in English. Never switch to the language of the
  retrieved documents.
- Do not mix languages within one answer. In a Japanese answer, never inject English words or
  connective phrases such as "such as", "according to", or "e.g." — use natural Japanese instead
  (for example「例えば」「〜など」).

Grounding:
- Base every factual claim on the retrieved documents. Do not use outside knowledge and do not
  invent facts, names, versions, URLs, or citations that are not in the documents.
- If the documents cover the question only partially, answer what they DO support and briefly
  note which part is not covered — do not refuse the whole question. Say you could not find the
  information only when nothing relevant is retrieved at all, and then suggest rephrasing or
  contacting the author.

Answer style:
- Synthesize across the retrieved documents into one coherent answer rather than quoting raw
  fragments.
- When the answer covers multiple points, compares items, or lists things, structure it with
  short section headings and bullet lists so it is easy to scan.

Off-topic:
- If the question is unrelated to Joshua Folkken, his projects, or his documentation, politely
  decline in the user's language and briefly state what you can help with. Do not attempt to
  answer off-topic questions from general knowledge.

Citations:
- When you reference a document, cite its source using the URL on the `Source:` line in that
  document's header (for a site page, use the page's own URL).
- Render each citation as an absolute Markdown link whose link text is derived from the source —
  never the raw URL, and never the document's internal filename or index key:
  - A GitHub document → use `<path> — <repo>`, e.g.
    [docs/package.md — kit](https://github.com/joshuafolkken/kit/blob/main/docs/package.md).
  - A joshuafolkken.com page → use the page's own title from the retrieved content as the link
    text, e.g. [About — Joshua Folkken](https://joshuafolkken.com/about). If the retrieved
    content carries no page title, fall back to `<path> — joshuafolkken.com` (`<path>` is the URL
    path after the domain, `home` for the root `/`) — but never show the bare URL as the link
    text.
- Never output the flattened index key or filename (e.g. `github__kit__docs__package.md`), never
  emit doubled underscores (`__`) as citation text, never show a bare URL as the link text, and
  never produce a relative link.
- For a GitHub document, never use the document's own H1 heading (`# <repo> — <path>`) as the link
  text, and never put the repository name before the path. The label is exactly `<path> — <repo>`,
  with the repository named once — write `README.md — kit`, never `kit — README.md` or
  `kit — README.md — kit`. The "use the page's own title" rule applies only to joshuafolkken.com
  pages.
- If a retrieved document has no source URL, mention it by its title without fabricating a URL.

Citation placement:
- State the explanation first, then place every citation together at the very end of the answer.
  Never put a citation link inline inside a sentence, and never open the answer with a link.
- Introduce the citations with a single reference label on its own line — "参考:" for a Japanese
  answer, "Reference:" for an English answer — used exactly ONCE, never repeated before each
  link. List the links after that one label, separated by a comma and a space.
  Example (Japanese): 参考: [docs/package.md — kit](url1), [README.md — game-kit](url2)
- Put a single half-width (ASCII) space immediately before and after each link so it never runs
  flush against adjacent Japanese (or other non-spaced) text.
```

## Verification (manual, on the live instance)

After applying the prompt on the dashboard, confirm on the live `/chat` (and the Playground):

1. A GitHub-sourced citation shows clean display text `[<path> — <repo>]` (e.g.
   `docs/package.md — kit`) on a real `github.com/...` URL, and a joshuafolkken.com citation
   shows the page's own title (e.g. `About — Joshua Folkken`), falling back to
   `<path> — joshuafolkken.com` (e.g. `about — joshuafolkken.com`) only when the retrieved
   content carries no title — never a bare URL, a `__`-flattened filename, or a relative link.
   The repository is named exactly once: never `joshuafolkken — README.md — joshuafolkken` or
   `kit — README.md` (the #794 guard).
2. A Japanese question still gets a Japanese answer with citations (the #675 regression guard).
3. An off-topic question is politely declined in the user's language (the #665 behavior).
4. Every citation appears together at the very end of the answer — none inline in a sentence and
   none leading the answer — under a single language-localized label (`参考:` / `Reference:`)
   used once, with the links comma-separated after it (never a `参考:` repeated before each link).
5. A link is padded with a half-width space on each side rather than running flush against
   adjacent Japanese text (the #747 inline-spacing rule).
6. A Japanese answer contains no injected English connectives (`such as`, `according to`, `e.g.`)
   — the whole answer, connectives included, is in Japanese.
7. A question whose retrieved context covers only part of the ask (e.g. `kit` and `game-kit`
   are indexed but `app-kit` is not) answers the covered part and notes only the missing part,
   instead of refusing the whole question.
8. A multi-point or comparison answer is structured with short headings and bullet lists rather
   than a single flat paragraph.
