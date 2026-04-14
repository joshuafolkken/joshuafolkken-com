<script lang="ts">
	import { AUTHOR } from '$lib/app'
	import { ICON_SIZE_MD, LINK_BASE_DEFAULT_CLASS } from '$lib/constants/layout'
	import MailIcon from '$lib/icons/MailIcon.svelte'
	import { email_utilities } from '$lib/utils/email-utilities'

	const { local: EMAIL_LOCAL, domain: EMAIL_DOMAIN } = email_utilities.split(AUTHOR.EMAIL)
	const EMAIL_VALUE = email_utilities.assemble(EMAIL_LOCAL, EMAIL_DOMAIN)
	const MAILTO_HREF = `mailto:${EMAIL_VALUE}`

	const BUTTON_CLASS =
		'inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-800/40 px-4 py-2 text-white/80 transition hover:border-white/30 hover:bg-slate-800/70 hover:text-white'

	let is_revealed = $state(false)

	function reveal(): void {
		is_revealed = true
	}
</script>

{#if is_revealed}
	<a href={MAILTO_HREF} class="{LINK_BASE_DEFAULT_CLASS} inline-flex items-center gap-2">
		<MailIcon size={ICON_SIZE_MD} />
		<span data-testid="contact-email-address">{EMAIL_VALUE}</span>
	</a>
{:else}
	<button type="button" class={BUTTON_CLASS} onclick={reveal} data-testid="contact-email-reveal">
		<MailIcon size={ICON_SIZE_MD} />
		<span>Reveal email address</span>
	</button>
{/if}
