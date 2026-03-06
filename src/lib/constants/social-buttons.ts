const SOCIAL_ACTION_BUTTON_BASE =
	'cyber-glow-hover inline-flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all duration-300 hover:scale-105 active:scale-95'

export const SOCIAL_BUTTONS = {
	BASE: SOCIAL_ACTION_BUTTON_BASE,
	TWITTER_HOVER: 'hover:border-white/20 hover:bg-white/10 hover:text-white',
	FACEBOOK_HOVER: 'hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 hover:text-[#1877F2]',
	COPY_HOVER: 'hover:border-sky-400/30 hover:bg-sky-500/10 hover:text-sky-400',
} as const
