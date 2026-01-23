# Antigravity Rules

## Code Change Rules

Whenever modifying, adding, or deleting any code:

1. **Verify Type Safety**: Run `pnpm run check`.
2. **Verify Style and Quality**: Run `pnpm run lint`.
3. **Fix Issues**: If any check fails, fix all reported issues immediately.
4. **Repeat**: Repeat the checks until they pass.
5. **Completion**: Only finish the task or response after all checks pass.

**Constraint**: Never state "it should pass" without actually having run the commands and confirmed the output. Do not end a task while errors exist.

## Git Rules

- **No Commits**: DO NOT commit changes unless explicitly requested by the user.
- **Workflow Awareness**: Use `scripts/git-workflow.ts` (via `pnpm git`) when the user asks for git operations.
