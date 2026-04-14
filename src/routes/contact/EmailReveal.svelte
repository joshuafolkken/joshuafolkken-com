<script lang="ts">
	import { AUTHOR } from '$lib/app'
	import { ICON_SIZE_MD, LINK_BASE_DEFAULT_CLASS } from '$lib/constants/layout'
	import MailIcon from '$lib/icons/MailIcon.svelte'
	import { email_utilities } from '$lib/utils/email-utilities'

	const { local: EMAIL_LOCAL, domain: EMAIL_DOMAIN } = email_utilities.split(AUTHOR.EMAIL)

	let is_revealed = $state(false)
	let is_copied = $state(false)

	const email = $derived(email_utilities.assemble(EMAIL_LOCAL, EMAIL_DOMAIN))

	async function reveal_and_copy(): Promise<void> {
		is_revealed = true

		try {
			await navigator.clipboard.writeText(email)
			is_copied = true
		} catch {
			is_copied = false
		}
	}

	function handle_click(): void {
		void reveal_and_copy()
	}

	const BUTTON_CLASS =
		'inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-800/40 px-4 py-2 text-white/80 transition hover:border-white/30 hover:bg-slate-800/70 hover:text-white'
</script>

{#if is_revealed}
	<div class="flex flex-col gap-1">
		<a href="mailto:{email}" class="{LINK_BASE_DEFAULT_CLASS} inline-flex items-center gap-2">
			<MailIcon size={ICON_SIZE_MD} />
			<span data-testid="contact-email-address">{email}</span>
		</a>
		{#if is_copied}
			<span class="text-sm text-white/60" aria-live="polite">Copied to clipboard</span>
		{/if}
	</div>
{:else}
	<button
		type="button"
		class={BUTTON_CLASS}
		onclick={handle_click}
		data-testid="contact-email-reveal"
	>
		<MailIcon size={ICON_SIZE_MD} />
		<span>Reveal email address</span>
	</button>
{/if}
