<script lang="ts">
	import { APP, AUTHOR } from '$lib/app'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
</script>

<!-- Hero: full width, extends under sticky header -->
<header
	class="relative -mt-16 flex min-h-[min(100vh,1920px)] w-full flex-col items-center justify-center overflow-hidden"
	id="hero"
>
	<!-- Modern Background Layer -->
	<div class="absolute inset-0 bg-slate-950">
		<img
			src="/images/hero-bg.png"
			alt=""
			class="animate-image-slow h-full w-full object-cover opacity-40 mix-blend-screen"
			role="presentation"
		/>
		<!-- Animated Aurora/Glow Effects -->
		<div class="aurora aurora-1"></div>
		<div class="aurora aurora-2"></div>
		<div class="aurora aurora-3"></div>
	</div>

	<div class="relative z-10 flex flex-col items-center justify-center px-4 text-center">
		<div class="mb-8 scale-110 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
			<LogoIcon />
		</div>
		<h1 class="animate-title font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
			{AUTHOR.NAME}
		</h1>
		<p class="animate-desc mt-6 max-w-lg text-lg leading-relaxed text-white/60 md:text-xl">
			{APP.DESCRIPTION}
		</p>

		<div class="animate-btns mt-10 flex gap-4">
			<a
				href="#main-content"
				class="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-sky-400 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
			>
				Explore Work
			</a>
			<a
				href="/profile"
				class="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
			>
				About Me
			</a>
		</div>
	</div>

	<a href="#main-content" class="scroll-prompt" aria-label="Scroll to content">
		<div class="flex flex-col items-center gap-2">
			<span class="text-[10px] tracking-[0.3em] text-white/40 uppercase">Scroll</span>
			<div class="h-12 w-[1px] bg-linear-to-b from-white/40 to-transparent"></div>
		</div>
	</a>
</header>

<style>
	.animate-image-slow {
		animation: image-pan 26.67s ease-in-out infinite alternate;
	}

	@keyframes image-pan {
		0% {
			transform: scale(1) translate(0, 0);
		}
		100% {
			transform: scale(1.1) translate(-2%, -2%);
		}
	}

	.aurora {
		position: absolute;
		border-radius: 50%;
		filter: blur(60px);
		opacity: 0.75;
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.aurora-1 {
		top: -20%;
		left: -10%;
		width: 80%;
		height: 80%;
		background: radial-gradient(
			circle,
			rgba(56, 189, 248, 0.75) 0%,
			rgba(56, 189, 248, 0.25) 40%,
			transparent 65%
		);
		animation: aurora-move-1 8s ease-in-out infinite alternate;
	}

	.aurora-2 {
		bottom: -20%;
		right: -10%;
		width: 70%;
		height: 70%;
		background: radial-gradient(
			circle,
			rgba(99, 102, 241, 0.7) 0%,
			rgba(99, 102, 241, 0.2) 40%,
			transparent 65%
		);
		animation: aurora-move-2 10s ease-in-out infinite alternate-reverse;
	}

	.aurora-3 {
		top: 20%;
		right: 10%;
		width: 60%;
		height: 60%;
		background: radial-gradient(
			circle,
			rgba(232, 121, 249, 0.7) 0%,
			rgba(232, 121, 249, 0.15) 40%,
			transparent 65%
		);
		animation: aurora-move-3 6.67s ease-in-out infinite alternate;
	}

	@keyframes aurora-move-1 {
		0% {
			transform: translate(0, 0) scale(1) rotate(0deg);
			opacity: 0.5;
		}
		50% {
			transform: translate(15%, 10%) scale(1.2) rotate(15deg);
			opacity: 0.8;
		}
		100% {
			transform: translate(-5%, 5%) scale(1) rotate(-5deg);
			opacity: 0.6;
		}
	}

	@keyframes aurora-move-2 {
		0% {
			transform: translate(0, 0) scale(1.1) rotate(0deg);
			opacity: 0.4;
		}
		50% {
			transform: translate(-20%, -15%) scale(1.3) rotate(-20deg);
			opacity: 0.75;
		}
		100% {
			transform: translate(10%, 10%) scale(1.1) rotate(10deg);
			opacity: 0.55;
		}
	}

	@keyframes aurora-move-3 {
		0% {
			transform: translate(0, 0) scale(1) rotate(0deg);
			opacity: 0.4;
		}
		50% {
			transform: translate(-15%, 20%) scale(1.4) rotate(30deg);
			opacity: 0.75;
		}
		100% {
			transform: translate(20%, -10%) scale(1) rotate(-10deg);
			opacity: 0.55;
		}
	}

	.scroll-prompt {
		position: absolute;
		z-index: 20;
		bottom: 2rem;
		left: 50%;
		transform: translate(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		color: rgb(255 255 255 / 0.98);
		cursor: pointer;
		transition: color 0.2s;
		animation: fade-in-up-center 1s ease-out 1.2s both;
	}
	.scroll-prompt:hover {
		color: white;
	}

	.animate-title {
		animation: fade-in-up 0.8s ease-out 0.2s both;
	}
	.animate-desc {
		animation: fade-in-up 0.8s ease-out 0.4s both;
	}
	.animate-btns {
		animation: fade-in-up 0.8s ease-out 0.6s both;
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fade-in-up-center {
		from {
			opacity: 0;
			transform: translate(-50%, 20px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
</style>
