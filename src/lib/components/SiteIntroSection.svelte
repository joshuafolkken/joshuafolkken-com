<script lang="ts">
	/* eslint-disable max-len -- Japanese prose: a source line break renders as a stray space mid-sentence, so each paragraph stays on one line. Same convention as privacy/+page.svelte and terms/+page.svelte. */
	import SectionHeading from '$lib/components/SectionHeading.svelte'
	import BlogIcon from '$lib/icons/BlogIcon.svelte'
	import PackageIcon from '$lib/icons/PackageIcon.svelte'
	import UserIcon from '$lib/icons/UserIcon.svelte'
	import { PAGES } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'

	// The landing page is the first thing an AdSense reviewer and a first-time reader both see, and
	// until now it carried a name and a four-word tagline — nothing that says what this site is or
	// who writes it (#609). Written as prose rather than cards so the purpose is readable by people
	// and readable by crawlers.
	//
	// Deliberately hardcoded Japanese: this repository has no i18n infrastructure yet and #545 is
	// blocked on an upstream spec, so routing these strings through message keys would pull that
	// whole project into an AdSense fix. Revisit when #545 lands.
	const PARAGRAPH_CLASS = 'text-base leading-relaxed text-white/70'
	const LINK_CLASS =
		'text-sky-400 decoration-sky-400/30 underline-offset-4 transition hover:text-sky-300 hover:underline'

	const blog_href = link_utilities.get_href(PAGES.BLOG.link) ?? '#'
	const projects_href = link_utilities.get_href(PAGES.PROJECTS.link) ?? '#'
	const about_href = link_utilities.get_href(PAGES.ABOUT.link) ?? '#'
</script>

<!--
	`lang="ja"` marks this block as Japanese inside a document the server declares as English
	(`hooks.server.ts` sets `ja` only under /blog). The rest of the landing page — the hero, the
	section titles, the project names — really is English, so flipping the whole document would be
	the wrong call; HTML is built for exactly this, a run of another language marked where it starts.
	Without it a screen reader reads these paragraphs with English pronunciation rules.
-->
<section class="mb-20 flex flex-col gap-12" lang="ja" data-testid="site-intro">
	<div>
		<SectionHeading icon={UserIcon} title="このサイトについて" class="mb-5" />
		<p class={PARAGRAPH_CLASS}>
			個人でゲームとウェブアプリを作っている Joshua Folkken
			の開発記録です。日々の開発で詰まったこと、試したこと、途中で考えが変わったことを、うまくいかなかった過程ごと書いています。
		</p>
		<p class="{PARAGRAPH_CLASS} mt-4">
			会社の広報でも技術メディアでもありません。だから「こうすれば動きます」という結論だけでなく、そこに辿り着くまでに何を間違えたかも残しています。数か月後に自分で読み返して「なんでこうしたんだっけ」と困らないように書いていたら、結果として<a
				class={LINK_CLASS}
				href={about_href}>ひとりの開発者が手を動かした記録</a
			>がそのまま積み上がりました。
		</p>
	</div>

	<div>
		<SectionHeading icon={BlogIcon} title="ここで読めること" class="mb-5" />
		<p class={PARAGRAPH_CLASS}>
			SvelteKit と Cloudflare でサイトを組み立てる話、AI
			と一緒にコードを書く話、そしてゲーム制作の話が中心です。たとえば
			<a class={LINK_CLASS} href="/blog/mnemecha">3D パズルゲームをリリースするまで</a>、
			<a class={LINK_CLASS} href="/blog/ai-chat">自分のことだけ答える AI チャットを作った話</a>、
			<a class={LINK_CLASS} href="/blog/ai-refactoring"
				>AI と一緒にリファクタリングを進めるための仕組み</a
			>。
		</p>
		<p class="{PARAGRAPH_CLASS} mt-4">
			ひとつのテーマを何度も書き直しているのも特徴かもしれません。作った当初の判断が数か月後に間違いだったと分かることがあるので、そのときは元の記事に追記しています。読み物としてより、変わっていく過程の記録として読んでもらえたら嬉しいです。<a
				class={LINK_CLASS}
				href={blog_href}>記事の一覧</a
			>から探せます。
		</p>
	</div>

	<div>
		<SectionHeading icon={PackageIcon} title="作ってきたもの" class="mb-5" />
		<p class={PARAGRAPH_CLASS}>
			書いているだけではありません。ブラウザで遊べるゲーム、いま見ているこのサイト、そして開発そのものを支える
			<a class={LINK_CLASS} href="/projects/kit">npm パッケージ</a>
			まで、実際に動くものを公開しています。
		</p>
		<p class="{PARAGRAPH_CLASS} mt-4">
			どれも記事に書いた内容がそのまま形になったものです。何を考えて作り、どこで詰まり、その後どう変えたのか。それぞれの背景を
			<a class={LINK_CLASS} href={projects_href}>プロジェクト一覧</a
			>にまとめてあるので、記事と合わせて見てもらえると分かりやすいと思います。
		</p>
	</div>
</section>
