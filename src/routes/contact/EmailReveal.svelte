<script lang="ts">
	import { AUTHOR_EMAIL_ENCODED } from '$lib/app'
	import { ICON_SIZE_MD, LINK_BASE_DEFAULT_CLASS } from '$lib/constants/layout'
	import EyeIcon from '$lib/icons/EyeIcon.svelte'
	import MailIcon from '$lib/icons/MailIcon.svelte'
	import { email_utilities } from '$lib/utils/email-utilities'

	const BUTTON_CLASS =
		'group inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-slate-800/40 px-4 py-2 text-white/80 transition hover:border-white/30 hover:bg-slate-800/70 hover:text-white'
	const ICON_DEFAULT_CLASS = 'pointer-events-none inline-flex group-hover:hidden'
	const ICON_HOVER_CLASS = 'pointer-events-none hidden group-hover:inline-flex'

	let is_revealed = $state(false)
	let email_value = $state('')
	let mailto_href = $state('')

	function reveal(): void {
		is_revealed = true
		email_value = email_utilities.decode_xor(AUTHOR_EMAIL_ENCODED)
		mailto_href = `mailto:${email_value}`
	}
</script>

{#if is_revealed}
	<a href={mailto_href} class="{LINK_BASE_DEFAULT_CLASS} inline-flex items-center gap-2">
		<MailIcon size={ICON_SIZE_MD} />
		<span data-testid="contact-email-address">{email_value}</span>
	</a>
{:else}
	<button type="button" class={BUTTON_CLASS} onclick={reveal} data-testid="contact-email-reveal">
		<span class={ICON_DEFAULT_CLASS} data-testid="contact-email-reveal-icon-default">
			<MailIcon size={ICON_SIZE_MD} />
		</span>
		<span class={ICON_HOVER_CLASS} data-testid="contact-email-reveal-icon-hover">
			<EyeIcon size={ICON_SIZE_MD} />
		</span>
		<span>Reveal email address</span>
	</button>
{/if}
