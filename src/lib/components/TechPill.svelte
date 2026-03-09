<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import TechPillContent from '$lib/components/TechPillContent.svelte'
	import { ALL_ICONS, TECH_NAME_TO_LOGO } from '$lib/data/si-icons'
	import { tech_colors } from '$lib/data/tech-colors'
	import { tech_official_urls } from '$lib/data/tech-official-urls'

	const { name, logo = '' }: { name: string; logo?: string } = $props()

	const color = $derived(tech_colors.get(name))
	const logo_slug = $derived(logo || (TECH_NAME_TO_LOGO.get(name) ?? ''))
	const icon = $derived(logo_slug ? ALL_ICONS.get(logo_slug) : undefined)
	const is_dark_brand = $derived(tech_colors.is_dark(color))
	const official_url = $derived(tech_official_urls.get_official_url(name))

	const pill_class =
		'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs'
	const border_color = $derived(is_dark_brand ? tech_colors.DARK_BRAND_BORDER : `${color}40`)
	const text_color = $derived(is_dark_brand ? tech_colors.DARK_BRAND_TEXT : color)
	const bg_color = $derived(is_dark_brand ? color : `${color}10`)

	const content_properties = $derived(icon === undefined ? { name } : { name, icon })
</script>

{#if official_url}
	<a
		href={official_url}
		target={LINK_TARGET}
		rel={LINK_REL}
		class="{pill_class} transition-colors hover:opacity-90"
		style:border-color={border_color}
		style:color={text_color}
		style:background-color={bg_color}
		aria-label="Visit {name} official website"
	>
		<TechPillContent {...content_properties} />
	</a>
{:else}
	<span
		class={pill_class}
		style:border-color={border_color}
		style:color={text_color}
		style:background-color={bg_color}
	>
		<TechPillContent {...content_properties} />
	</span>
{/if}
