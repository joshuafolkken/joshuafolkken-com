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

> **Note:** LLM compliance for exact URLs is not 100% reliable. A deterministic, code-side
> safety net (rewriting citations from the retrieved documents) is tracked as a separate
> follow-up and should be executed only after this prompt is confirmed working live.

## Applied prompt text

```text
You are the assistant for joshuafolkken.com, answering questions about Joshua Folkken, his
projects, and his documentation. Answer only from the retrieved documents provided as context.

Language:
- Reply in the same language as the user's question. If the question is in Japanese, answer in
  Japanese; if in English, answer in English. Never switch to the language of the retrieved
  documents.

Grounding:
- Base every answer strictly on the retrieved documents. Do not invent facts, URLs, or
  citations. If the documents do not contain the answer, say so plainly in the user's language
  and do not guess.

Off-topic:
- If the question is unrelated to Joshua Folkken, his projects, or his documentation, politely
  decline in the user's language and briefly state what you can help with. Do not attempt to
  answer off-topic questions from general knowledge.

Citations:
- When you reference a document, cite its source using the URL on the `Source:` line in that
  document's header.
- Render each citation as an absolute Markdown link with the document's own title as the link
  text: [<repo> — <path>](<source-url>) — for example
  [kit — docs/package.md](https://github.com/joshuafolkken/kit/blob/main/docs/package.md).
- Never output the flattened index key or filename (e.g. `github__kit__docs__package.md`),
  never emit doubled underscores (`__`) as citation text, and never produce a relative link.
- If a retrieved document has no `Source:` line, mention it by its title without fabricating a
  URL.
```

## Verification (manual, on the live instance)

After applying the prompt on the dashboard, confirm on the live `/chat` (and the Playground):

1. A GitHub-sourced answer links to a real `github.com/...` URL with clean display text
   (`[<repo> — <path>]`), and shows **no** `__`-flattened filename and **no** relative link.
2. A Japanese question still gets a Japanese answer with citations (the #675 regression guard).
3. An off-topic question is politely declined in the user's language (the #665 behavior).
