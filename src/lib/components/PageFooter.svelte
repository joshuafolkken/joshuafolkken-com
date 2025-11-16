<script lang="ts">
	import { resolve } from '$app/paths'
	import { APP, AUTHOR } from '$lib/app'
</script>

<footer class="mt space-y-1 text-center text-sm text-white/60">
	<a href={resolve('/privacy-policy')} class="link-base">Privacy Policy</a>
	<div class="mt-4">
		<a href={resolve('/')} class="link-base">
			<p>{APP.NAME} v{APP.VERSION}</p>
			<p>{AUTHOR.COPYRIGHT}</p>
		</a>
	</div>
</footer>
