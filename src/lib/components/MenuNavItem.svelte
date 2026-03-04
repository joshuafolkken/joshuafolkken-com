<script lang="ts">
	import type { Page } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'

	const {
		page: menu_page,
		is_active,
		variant = 'desktop',
		on_click,
	}: {
		page: Page
		is_active: boolean
		variant?: 'desktop' | 'mobile'
		on_click?: () => void
	} = $props()

	const href = $derived(link_utilities.get_href(menu_page.link))
	const is_link = $derived(Boolean(href && !link_utilities.is_external_link(menu_page.link)))

	const desktop_classes =
		'group relative flex items-center gap-2 px-3 py-2 text-base font-medium transition-colors'
	const mobile_classes =
		'group -mx-4 flex items-center gap-3 rounded-none border-l-2 px-4 py-3 text-base transition-colors duration-300 hover:bg-white/10'

	const active_desktop = 'text-sky-400'
	const inactive_desktop = 'text-white/60 hover:text-white'
	const active_mobile =
		'border-sky-400 text-sky-400 hover:text-sky-400 [&_svg]:text-sky-400 hover:[&_svg]:text-sky-400'
	const inactive_mobile = 'border-transparent text-white/70 hover:text-white [&_svg]:text-inherit'

	const active_class = $derived.by(() => {
		if (variant === 'desktop') {
			return is_active ? active_desktop : inactive_desktop
		}

		return is_active ? active_mobile : inactive_mobile
	})

	const link_classes = $derived(
		variant === 'desktop'
			? `${desktop_classes} ${active_class}`
			: `${mobile_classes} ${active_class}`,
	)

	const icon_class = $derived(
		variant === 'desktop'
			? 'transition-transform group-hover:-translate-y-0.5'
			: 'transition-transform group-hover:translate-x-1',
	)
</script>

{#if is_link && href}
	<a {href} class={link_classes} onclick={on_click}>
		{#if menu_page.icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = menu_page.icon}
			<Icon size="1.25rem" class={icon_class} />
		{/if}
		<span>{menu_page.title}</span>
		{#if variant === 'desktop' && is_active}
			<span class="absolute right-1.5 bottom-1 left-1.5 h-px bg-sky-400/50"></span>
		{/if}
	</a>
{/if}
