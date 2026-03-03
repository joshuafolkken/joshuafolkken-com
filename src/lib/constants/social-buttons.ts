const SOCIAL_ACTION_BUTTON_BASE =
	'inline-flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-all duration-300'

export const SOCIAL_BUTTONS = {
	BASE: SOCIAL_ACTION_BUTTON_BASE,
	TWITTER_HOVER: 'hover:border-black hover:bg-black hover:text-white',
	FACEBOOK_HOVER: 'hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white',
	COPY_HOVER: 'hover:border-white/0 hover:bg-white/20 hover:text-white',
} as const
