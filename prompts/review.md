# Code Review Prompt

This document is the **single source of truth** for Claude Code when reviewing the current diff before committing.

The goal is to catch every concrete issue in **one pass** so that re-reviewing after each commit is unnecessary. Do not hold findings back for a later review.

---

## When to run

- Before every `git commit` on a feature branch
- Before running `pnpm git` / `pnpm git:followup` to open a PR
- Scope: the staged diff (`git diff --staged`) and the cumulative PR diff (`git diff main...HEAD`)

Re-run after applying fixes until **no high or medium findings remain**. Low findings may be acknowledged and skipped with a reason.

---

## Review output format

Output every category below with an explicit verdict. If a category has no findings, write `No issues`. Do **not** omit categories — an empty section is how we prove the category was checked.

For each finding:

- Cite `file_path:line_number`
- State **severity** (`high` / `medium` / `low`)
- Explain the concrete problem and the minimal fix
- Skip generic praise; only comment where there is actionable feedback

Template:

```md
### Bug risks & logic errors

- `src/foo.ts:42` (high) — <problem> — <fix>

### Security

No issues

### Performance

- `src/bar.svelte:15` (medium) — <problem> — <fix>

### Project conventions

No issues

### i18n

No issues

### Tests

No issues

### Summary

<1-2 lines: total counts by severity and overall go/no-go>
```

---

## Review categories (must all be checked)

### 1. Bug risks & logic errors

- Off-by-one, nullability, promise handling, race conditions, error handling in the diff
- Broken invariants, wrong return types, mishandled edge cases
- Regressions: does the change break any existing behavior covered elsewhere?

### 2. Security

- Injection (SQL, command, path traversal), XSS, CSRF
- Auth / authorization gaps, secret or token handling, unsafe deserialization
- Unsafe `as` casts that widen trust boundaries

### 3. Performance

- Obvious hotspots, N+1 queries, unnecessary re-renders / reactive churn
- Large payloads, unbounded loops, blocking I/O on request paths
- Avoid speculative micro-optimization — flag only concrete impact

### 4. Project conventions (`CLAUDE.md` / `AGENTS.md` / `GEMINI.md`)

Verify **every** rule below. These are non-standard, so call out any violation.

- **Naming**: `snake_case` for variables / functions / params; `PascalCase` for types / classes / interfaces / enums; `UPPER_CASE` for enum members and constants; booleans prefixed `is_` / `has_` / `should_` / `can_` / `will_` / `did_`
- **Functions & exports**: `function` syntax (not arrow); multiple functions grouped into a namespace object `export { my_module }`; no `export default`
- **Files**: Svelte → `PascalCase.svelte` / `PascalCase.svelte.ts`; TypeScript → `kebab-case.ts` (route files exempt)
- **Quality limits**: function complexity ≤4, nesting ≤1, function ≤25 lines, file ≤300 lines, params ≤3; magic numbers extracted to `UPPER_CASE` constants except `0`, `1`, `-1`; no `any`, no unused vars, no floating promises; explicit param and return types
- **Early return**: single `return` under 100 chars → one-liner `if (x) return y`
- **Svelte**: `$state` is reassignable; `Props` interface name is allowed; DOM manipulation restricted

### 5. i18n

- All user-visible strings (labels, buttons, toasts, validation errors, page titles) use message keys
- Message keys are added to **all** locale message files, not just one
- No hardcoded user-visible strings slipped in

### 6. Tests

- Every code change has a corresponding test (unit or E2E) per `CLAUDE.md` Code Change Rules Step 0
- Test titles are English only
- Test names describe behavior, not implementation

### 7. Comments & content

- Comments are English only
- No narration comments (`// Added for issue #123`, `// TODO: refactor later`) — only comments explaining non-obvious _why_
- No duplicated logic that should be extracted

---

## Stop conditions

- **High** findings → must fix before committing
- **Medium** findings → must fix before opening the PR
- **Low** findings → document in the PR body if skipped

If the diff is empty or trivial (e.g. whitespace only), state that explicitly and skip the review.
