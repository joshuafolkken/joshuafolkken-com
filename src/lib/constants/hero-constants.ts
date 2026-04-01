/** Caps hero block min-height so very large viewports do not stretch excessively. */
const HERO_MIN_HEIGHT_CAP_PX = 1920

const HERO_CTA_BASE_CLASS =
	'cyber-glow-hover rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-110 active:scale-95'

const HERO_CTA_PRIMARY_CLASS = 'bg-white text-slate-950 hover:bg-sky-400 hover:text-white'

const HERO_CTA_SECONDARY_CLASS =
	'border border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/10 hover:shadow-[0_0_20px_4px_rgb(56_189_248/0.2),0_0_40px_12px_rgb(56_189_248/0.12),0_0_60px_20px_rgb(56_189_248/0.06)]'

export {
	HERO_CTA_BASE_CLASS,
	HERO_CTA_PRIMARY_CLASS,
	HERO_CTA_SECONDARY_CLASS,
	HERO_MIN_HEIGHT_CAP_PX,
}
