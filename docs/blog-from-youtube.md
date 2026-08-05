# Blog posts from YouTube talks

How a YouTube live-stream recording becomes a published `talk-*` blog post.

The pipeline turns the stream's audio into a first-person article containing **only the host's
(Joshua's) opinions**, then writes it to `src/lib/posts/`. Everything up to the draft is
automated; the pre-publish review in [Review before publishing](#review-before-publishing) is
manual and **must not be skipped** — there is no draft flag, so every `.md` under
`src/lib/posts/` is live the moment it is deployed.

## Prerequisites

| Requirement                   | Notes                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `yt-dlp` on `PATH`            | `brew install yt-dlp` (macOS). Keep it current — YouTube changes break old builds.                          |
| Chrome, signed in to YouTube  | The download reads Chrome's cookies (`--cookies-from-browser chrome`); Chrome is also used for the preview. |
| `ffmpeg` on `PATH`            | `brew install ffmpeg` — a separate formula, not a `yt-dlp` dependency. Without it the opus re-encode fails. |
| `GEMINI_API_KEY` in `.env`    | Create a key at <https://aistudio.google.com/apikey>. See [Model choice](#model-choice).                    |
| `pnpm dev` running (optional) | Only needed for the preview tab the pipeline opens at the end.                                              |

## Generate the draft

One command does everything:

```bash
pnpm yt:talk 'https://www.youtube.com/watch?v=<video-id>'
```

A bare video id works too. Expect the run to take several minutes for a 2–3 hour stream — most of
it is the model reading the audio.

### What it does

[`scripts/yt-talk.ts`](../scripts/yt-talk.ts) chains the steps below. Each is also runnable on its
own (see [Running a single stage](#running-a-single-stage)).

1. **Download** — [`scripts/yt-audio.ts`](../scripts/yt-audio.ts) runs `yt-dlp` and writes
   `<title> [<id>].opus` plus `<title> [<id>].info.json` into `.audio/` (git-ignored). The audio is
   re-encoded to 16 kbps mono opus ([`scripts/opus-encoding.ts`](../scripts/opus-encoding.ts)) so a
   multi-hour stream stays small enough to upload. **If the audio for that video id is already in
   `.audio/`, the download is skipped** and only the article is regenerated.
2. **Generate** — [`scripts/audio-to-article.ts`](../scripts/audio-to-article.ts) uploads the audio
   through the Gemini File API, waits for it to finish processing (up to 3 minutes), and runs
   [`prompts/audio-to-article-3.md`](../prompts/audio-to-article-3.md) over it. That prompt is where
   the editorial rules live: speaker attribution by voice, exhaustive topic coverage, first-person
   です・ます prose, and no other participant's name anywhere in the output.
3. **Inject frontmatter** — [`scripts/inject-talk-frontmatter.ts`](../scripts/inject-talk-frontmatter.ts)
   replaces the `{{PUBLISH_DATE}}` / `{{YOUTUBE_URL}}` / `{{YOUTUBE_DATE}}` / `{{YOUTUBE_TITLE}}`
   placeholders with values read from `.info.json`. The model is forbidden from writing these four
   fields itself precisely so they cannot be fabricated.
4. **Write and preview** — the article is written to `src/lib/posts/talk-<video-upload-date>.md`
   (**an existing file at that path is overwritten**) and opened at
   `http://localhost:5173/blog/talk-<video-upload-date>` in Chrome.

### The resulting frontmatter

```yaml
title: '…' # chosen by the model
date: '2026-08-05' # generation date = article publish date
author: 'Joshua Folkken'
excerpt: '…' # chosen by the model
tags: ['from-talk', …] # chosen by the model
youtube: 'https://www.youtube.com/watch?v=…'
youtube_date: '2026-01-22' # the video's own publish date — not the article's
youtube_title: '…' # the video's own title — not the article's
```

`date` and `youtube_date` are deliberately separate: a stream recorded months ago can be published
today. No `cover_image` is needed — [`BlogCard.svelte`](../src/lib/components/BlogCard.svelte) falls
back to the YouTube thumbnail whenever `youtube` is set, and the article page renders the embed and
the "this was transcribed from a video" disclosure from the same field. Add `updated` by hand only
when revising an already-published post.

## Review before publishing

The draft is not publishable as-is. Work through this list on the generated file:

- [ ] **Delete the trailing `## 【要確認】` section.** The prompt parks every topic whose speaker
      could not be confirmed there instead of guessing. Decide each item — promote it into the body
      only if you know it is yours, otherwise drop it — then remove the whole section. No published
      post contains one.
- [ ] **No other participant's name** appears in the body, title, excerpt or tags. Co-hosts and
      guests must be referred to generically (「同席者」) if at all. Mis-attributing someone else's
      opinion is the failure mode this whole pipeline is built to avoid.
- [ ] **です・ます throughout the body.** The prompt pins the tone; a drift into だ・である reads as
      a different author.
- [ ] **Title, excerpt and tags** reflect only what survived into the body.
- [ ] **Read the rendered page**, not just the Markdown — check the video embed, the thumbnail and
      the reading layout in the preview tab.

Then commit the post like any other change (`pnpm josh git`). Publishing is the deploy; there is no
separate index to update. `docs/**.md` and `prompts/**.md` are also picked up by
`pnpm ingest:github-docs`, so this document and the generation prompt are searchable from the site's
`/chat` assistant.

## Running a single stage

| Command                                               | Use when                                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm yt:audio '<url>'`                               | You only want the audio in `.audio/` (e.g. to check length before spending a model call).   |
| `pnpm yt:article '<url-or-id>'`                       | The audio is already downloaded and you want to regenerate the article — the common re-run. |
| `pnpm article:frontmatter <article.md> '<url-or-id>'` | A hand-edited draft still has `{{…}}` placeholders to fill.                                 |

## Configuration

Set in `.env` (see `.env.example`):

| Variable               | Default                         | Effect                                                                      |
| ---------------------- | ------------------------------- | --------------------------------------------------------------------------- |
| `GEMINI_API_KEY`       | —                               | Required.                                                                   |
| `GEMINI_MODEL`         | `gemini-3.5-flash`              | See [Model choice](#model-choice).                                          |
| `AUDIO_ARTICLE_PROMPT` | `prompts/audio-to-article-3.md` | Point at another prompt file to try a revision without editing the default. |
| `PREVIEW_BASE_URL`     | `http://localhost:5173/blog`    | Where the finished draft is opened.                                         |

### Model choice

The default `gemini-3.5-flash` works on the free tier and is fine for a first pass. Speaker
attribution — the hardest part of a multi-speaker stream, and the one error that matters most — is
noticeably better on a Pro model (e.g. `gemini-3.1-pro-preview`), which needs a billed key: Pro
models report zero free-tier quota, and the free tier's 250k tokens/minute cap can reject a long
audio request outright. Free-tier inputs may also be used to improve Google's models.

## Troubleshooting

| Symptom                                              | Cause and fix                                                                                                                                  |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `yt-dlp exited with 1`                               | Usually stale cookies or an outdated `yt-dlp`. Open the video in Chrome while signed in, then `brew upgrade yt-dlp`.                           |
| `No audio file for "…" in .audio`                    | A partial download left the `.info.json` without its audio. Delete both files for that video and re-run.                                       |
| `Timed out waiting for the audio to process`         | The File API stayed in `PROCESSING` for over 3 minutes. Re-run — the audio is cached locally, so only the upload repeats.                      |
| `Gemini returned an empty response`                  | Typically a quota rejection on a long free-tier request. Switch to a billed key or a smaller model, and see [Model choice](#model-choice).     |
| Article attributes someone else's opinions to Joshua | A model-quality problem, not a code bug. Regenerate with a Pro model; if it persists, tighten the attribution rules in the prompt.             |
| Placeholders such as `{{YOUTUBE_URL}}` survive       | The model reformatted them (e.g. into bold). Re-run `pnpm article:frontmatter` on the file, which also accepts the `__X__` / `**X**` variants. |
