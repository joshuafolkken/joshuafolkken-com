<script lang="ts">
	/* eslint-disable max-lines */
	// Logo Icon Proposals Component
</script>

<div class="mb-8 space-y-8">
	<h2 class="text-2xl font-light">Logo Icon Proposals</h2>

	<!-- 提案1: JF モノグラム -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">1. JF Monogram (シンプルなイニシャル)</h3>
		<p class="text-sm text-white/60">
			Joshua Folkken のイニシャル「JF」を組み合わせたモノグラム。シンプルで洗練されたデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="JF Monogram Logo"
			>
				<title>JF Monogram</title>
				<!-- J: 上に横線、下に縦線、下が左に曲がる -->
				<!-- 上の横線 -->
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<!-- 縦線 -->
				<rect x="28" y="28" width="8" height="40" fill="currentColor"></rect>
				<!-- 下のフック（左に曲がる） -->
				<rect x="20" y="68" width="16" height="8" fill="currentColor"></rect>
				<rect x="20" y="68" width="8" height="12" fill="currentColor"></rect>
				<!-- F: 縦線、上に横線、真ん中に横線 -->
				<!-- 縦線 -->
				<rect x="55" y="20" width="8" height="55" fill="currentColor"></rect>
				<!-- 上の横線 -->
				<rect x="55" y="20" width="25" height="8" fill="currentColor"></rect>
				<!-- 真ん中の横線 -->
				<rect x="55" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="JF Monogram Logo Variant"
			>
				<title>JF Monogram Variant</title>
				<!-- J (ストローク): 上に横線、下に縦線、下が左に曲がる -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="5"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M20 25 L40 25 M30 25 L30 70 Q30 80, 20 80"
				></path>
				<!-- F (ストローク): 縦線、上に横線、真ん中に横線 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="5"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M55 25 L55 80 M55 25 L80 25 M55 50 L75 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案2: 未来を象徴する星と光 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">2. Star & Light (未来を象徴)</h3>
		<p class="text-sm text-white/60">
			「Creating the future」のテーマに合わせた、星と光のビームを組み合わせたデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Star and Light Logo"
			>
				<title>Star and Light</title>
				<circle cx="50" cy="50" r="3" fill="currentColor"></circle>
				<path
					fill="currentColor"
					d="M50 20 L52 45 L50 50 L48 45 Z M50 80 L52 55 L50 50 L48 55 Z M20 50 L45 48 L50 50 L45 52 Z M80 50 L55 48 L50 50 L55 52 Z"
				></path>
				<path
					fill="currentColor"
					d="M35 35 L42 42 L50 50 L42 42 Z M65 35 L58 42 L50 50 L58 42 Z M35 65 L42 58 L50 50 L42 58 Z M65 65 L58 58 L50 50 L58 58 Z"
					opacity="0.6"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Star and Light Variant"
			>
				<title>Star and Light Variant</title>
				<path
					fill="currentColor"
					d="M50 15 L55 40 L50 50 L45 40 Z M50 85 L55 60 L50 50 L45 60 Z M15 50 L40 45 L50 50 L40 55 Z M85 50 L60 45 L50 50 L60 55 Z"
				></path>
				<circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案3: 幾何学的な抽象デザイン -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">3. Geometric Abstract (モダンな幾何学)</h3>
		<p class="text-sm text-white/60">
			シンプルな幾何学的形状を組み合わせた、モダンで抽象的なデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Geometric Abstract Logo"
			>
				<title>Geometric Abstract</title>
				<rect x="20" y="20" width="30" height="30" fill="currentColor"></rect>
				<rect x="50" y="50" width="30" height="30" fill="currentColor" opacity="0.7"></rect>
				<path fill="currentColor" d="M20 50 L50 20 L50 50 Z" opacity="0.5"></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Geometric Abstract Variant"
			>
				<title>Geometric Abstract Variant</title>
				<circle cx="30" cy="30" r="15" fill="currentColor"></circle>
				<circle cx="70" cy="70" r="15" fill="currentColor"></circle>
				<path fill="none" stroke="currentColor" stroke-width="3" d="M30 30 L70 70"></path>
			</svg>
		</div>
	</div>

	<!-- 提案4: 言語/コミュニケーション -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">4. Communication Waves (言語学習のテーマ)</h3>
		<p class="text-sm text-white/60">
			Talk アプリの言語学習テーマに合わせた、音波やコミュニケーションを表現したデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Communication Waves Logo"
			>
				<title>Communication Waves</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					d="M20 50 Q30 30, 40 50 T60 50 T80 50"
				></path>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					d="M20 50 Q30 70, 40 50 T60 50 T80 50"
					opacity="0.6"
				></path>
				<circle cx="50" cy="50" r="3" fill="currentColor"></circle>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Communication Waves Variant"
			>
				<title>Communication Waves Variant</title>
				<path fill="currentColor" d="M30 50 L50 30 L50 50 Z"></path>
				<path fill="currentColor" d="M50 50 L70 30 L70 50 Z" opacity="0.7"></path>
				<path fill="currentColor" d="M30 50 L50 70 L50 50 Z" opacity="0.5"></path>
				<path fill="currentColor" d="M50 50 L70 70 L70 50 Z" opacity="0.3"></path>
			</svg>
		</div>
	</div>

	<!-- 提案5: テクノロジーと未来の融合 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">5. Tech Future Fusion (テクノロジー × 未来)</h3>
		<p class="text-sm text-white/60">
			テクノロジーと未来を組み合わせた、矢印と回路をモチーフにしたデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Tech Future Fusion Logo"
			>
				<title>Tech Future Fusion</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M20 50 L50 20 L50 50 L80 50"
				></path>
				<circle cx="50" cy="50" r="5" fill="currentColor"></circle>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					d="M35 35 L45 45 M55 45 L65 35 M35 65 L45 55 M55 55 L65 65"
					opacity="0.5"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Tech Future Fusion Variant"
			>
				<title>Tech Future Fusion Variant</title>
				<rect
					x="25"
					y="25"
					width="50"
					height="50"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
				></rect>
				<path fill="currentColor" d="M50 25 L60 40 L50 50 L40 40 Z"></path>
				<circle cx="50" cy="50" r="3" fill="currentColor"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案6: ミニマルな「J」デザイン -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">6. Minimalist J (ミニマルなJ)</h3>
		<p class="text-sm text-white/60">
			Joshua の「J」をモチーフにした、シンプルでエレガントなデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Minimalist J Logo"
			>
				<title>Minimalist J</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="5"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M50 20 L50 70 Q50 80, 40 80 L30 80"
				></path>
				<path fill="currentColor" d="M50 20 L70 20 L70 30 L50 30 Z"></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Minimalist J Variant"
			>
				<title>Minimalist J Variant</title>
				<path
					fill="currentColor"
					d="M50 20 L70 20 L70 70 Q70 80, 60 80 L40 80 Q30 80, 30 70 L30 60 L50 60 L50 70 L40 70 Q40 70, 40 70 L40 70 Q40 70, 50 70 L50 20 Z"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案7: 上向き矢印（未来への前進） -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">7. Upward Arrow (未来への前進)</h3>
		<p class="text-sm text-white/60">
			「Creating the future」を象徴する、上向きの矢印とダイナミックな動きを表現したデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Upward Arrow Logo"
			>
				<title>Upward Arrow</title>
				<path fill="currentColor" d="M50 20 L60 40 L55 40 L55 70 L45 70 L45 40 L40 40 Z"></path>
				<rect x="30" y="70" width="40" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Upward Arrow Variant"
			>
				<title>Upward Arrow Variant</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M50 25 L50 65 M50 25 L35 40 M50 25 L65 40"
				></path>
				<rect x="30" y="65" width="40" height="6" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案8: リズム・パルス（言語学習のリズム感） -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">8. Rhythm Pulse (言語学習のリズム)</h3>
		<p class="text-sm text-white/60">
			Talk アプリの「Listen and Repeat」をイメージした、リズムとパルスを表現したデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Rhythm Pulse Logo"
			>
				<title>Rhythm Pulse</title>
				<rect x="20" y="40" width="8" height="20" fill="currentColor"></rect>
				<rect x="32" y="30" width="8" height="40" fill="currentColor"></rect>
				<rect x="44" y="35" width="8" height="30" fill="currentColor"></rect>
				<rect x="56" y="25" width="8" height="50" fill="currentColor"></rect>
				<rect x="68" y="35" width="8" height="30" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Rhythm Pulse Variant"
			>
				<title>Rhythm Pulse Variant</title>
				<circle cx="25" cy="50" r="8" fill="currentColor"></circle>
				<circle cx="40" cy="50" r="12" fill="currentColor"></circle>
				<circle cx="60" cy="50" r="15" fill="currentColor"></circle>
				<circle cx="75" cy="50" r="10" fill="currentColor"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案9: 円と線の融合（シンプルで洗練） -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">9. Circle & Line Fusion (シンプルで洗練)</h3>
		<p class="text-sm text-white/60">
			円と線を組み合わせた、ミニマルで洗練されたデザイン。シンプルさの中に力強さを表現。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Circle and Line Fusion Logo"
			>
				<title>Circle and Line Fusion</title>
				<circle cx="50" cy="30" r="12" fill="currentColor"></circle>
				<rect x="45" y="42" width="10" height="35" fill="currentColor"></rect>
				<circle cx="50" cy="85" r="8" fill="currentColor"></circle>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Circle and Line Fusion Variant"
			>
				<title>Circle and Line Fusion Variant</title>
				<circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="4"></circle>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					d="M50 30 L50 70 M30 50 L70 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案10: ジオメトリックな「JF」融合 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">10. Geometric JF Fusion (ジオメトリックな融合)</h3>
		<p class="text-sm text-white/60">J と F を幾何学的に融合させた、モダンでユニークなデザイン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Geometric JF Fusion Logo"
			>
				<title>Geometric JF Fusion</title>
				<!-- J の要素 -->
				<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="20" y="62" width="12" height="8" fill="currentColor"></rect>
				<!-- F の要素（J と重なる） -->
				<rect x="40" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="40" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="40" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Geometric JF Fusion Variant"
			>
				<title>Geometric JF Fusion Variant</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M25 25 L25 70 Q25 80, 15 80 M25 25 L45 25 M45 25 L45 75 M45 25 L70 25 M45 50 L65 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案11: 光の粒子・ドットパターン -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">11. Light Particles (光の粒子)</h3>
		<p class="text-sm text-white/60">
			未来を象徴する光の粒子が集まり、新しい形を創り出すデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Light Particles Logo"
			>
				<title>Light Particles</title>
				<circle cx="30" cy="30" r="4" fill="currentColor"></circle>
				<circle cx="50" cy="25" r="5" fill="currentColor"></circle>
				<circle cx="70" cy="30" r="4" fill="currentColor"></circle>
				<circle cx="35" cy="50" r="4" fill="currentColor"></circle>
				<circle cx="50" cy="50" r="6" fill="currentColor"></circle>
				<circle cx="65" cy="50" r="4" fill="currentColor"></circle>
				<circle cx="30" cy="70" r="4" fill="currentColor"></circle>
				<circle cx="50" cy="75" r="5" fill="currentColor"></circle>
				<circle cx="70" cy="70" r="4" fill="currentColor"></circle>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Light Particles Variant"
			>
				<title>Light Particles Variant</title>
				<circle cx="50" cy="50" r="3" fill="currentColor"></circle>
				<circle
					cx="50"
					cy="50"
					r="15"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					opacity="0.5"
				></circle>
				<circle
					cx="50"
					cy="50"
					r="25"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					opacity="0.3"
				></circle>
				<circle cx="35" cy="35" r="2" fill="currentColor"></circle>
				<circle cx="65" cy="35" r="2" fill="currentColor"></circle>
				<circle cx="35" cy="65" r="2" fill="currentColor"></circle>
				<circle cx="65" cy="65" r="2" fill="currentColor"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案12: 抽象的な鳥・羽（未来への飛翔） -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">12. Abstract Wing (未来への飛翔)</h3>
		<p class="text-sm text-white/60">
			未来への飛翔をイメージした、抽象的な鳥の羽や翼をモチーフにしたデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Abstract Wing Logo"
			>
				<title>Abstract Wing</title>
				<path fill="currentColor" d="M50 20 L30 50 L50 60 L70 50 Z"></path>
				<path fill="currentColor" d="M50 60 L35 75 L50 80 L65 75 Z" opacity="0.8"></path>
				<path fill="currentColor" d="M50 80 L40 90 L50 95 L60 90 Z" opacity="0.6"></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Abstract Wing Variant"
			>
				<title>Abstract Wing Variant</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					d="M50 20 Q30 40, 20 60 Q30 70, 50 80 Q70 70, 80 60 Q70 40, 50 20"
				></path>
				<path fill="none" stroke="currentColor" stroke-width="2" d="M50 20 L50 80" opacity="0.5"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案13: 回路パターン（テクノロジー） -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">13. Circuit Pattern (テクノロジー回路)</h3>
		<p class="text-sm text-white/60">
			テクノロジーとイノベーションを表現した、回路パターンをモチーフにしたデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Circuit Pattern Logo"
			>
				<title>Circuit Pattern</title>
				<rect
					x="20"
					y="20"
					width="60"
					height="60"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				></rect>
				<rect
					x="30"
					y="30"
					width="40"
					height="40"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				></rect>
				<circle cx="50" cy="50" r="5" fill="currentColor"></circle>
				<rect x="48" y="20" width="4" height="10" fill="currentColor"></rect>
				<rect x="48" y="70" width="4" height="10" fill="currentColor"></rect>
				<rect x="20" y="48" width="10" height="4" fill="currentColor"></rect>
				<rect x="70" y="48" width="10" height="4" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Circuit Pattern Variant"
			>
				<title>Circuit Pattern Variant</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					d="M25 25 L50 25 L50 50 L75 50 M25 75 L50 75 L50 50"
				></path>
				<circle cx="25" cy="25" r="4" fill="currentColor"></circle>
				<circle cx="75" cy="50" r="4" fill="currentColor"></circle>
				<circle cx="25" cy="75" r="4" fill="currentColor"></circle>
				<circle cx="50" cy="50" r="5" fill="currentColor"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案14: 音波の可視化（言語・コミュニケーション） -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">14. Sound Wave Visualization (音波の可視化)</h3>
		<p class="text-sm text-white/60">
			言語学習とコミュニケーションを表現した、音波を可視化したデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Sound Wave Visualization Logo"
			>
				<title>Sound Wave Visualization</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					d="M20 50 L30 30 L40 70 L50 20 L60 80 L70 40 L80 60"
				></path>
				<circle cx="50" cy="50" r="3" fill="currentColor"></circle>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Sound Wave Visualization Variant"
			>
				<title>Sound Wave Visualization Variant</title>
				<path
					fill="currentColor"
					d="M20 50 L25 30 L30 50 L35 70 L40 50 L45 20 L50 50 L55 80 L60 50 L65 40 L70 50 L75 60 L80 50 Z"
					opacity="0.7"
				></path>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					d="M20 50 L25 30 L30 50 L35 70 L40 50 L45 20 L50 50 L55 80 L60 50 L65 40 L70 50 L75 60 L80 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案15: モダンなタイポグラフィベース -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">15. Modern Typography (モダンなタイポグラフィ)</h3>
		<p class="text-sm text-white/60">
			タイポグラフィをベースにした、モダンで洗練された「jf」のロゴマーク。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Modern Typography Logo"
			>
				<title>Modern Typography</title>
				<!-- j -->
				<path fill="currentColor" d="M25 20 L25 60 Q25 70, 15 70 L15 65 Q20 65, 20 60 L20 20 Z"
				></path>
				<rect x="20" y="15" width="10" height="5" fill="currentColor"></rect>
				<!-- f -->
				<rect x="45" y="15" width="5" height="55" fill="currentColor"></rect>
				<rect x="45" y="15" width="20" height="5" fill="currentColor"></rect>
				<rect x="45" y="40" width="15" height="5" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Modern Typography Variant"
			>
				<title>Modern Typography Variant</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M25 25 L25 65 Q25 75, 15 75 M25 25 L35 25 M50 25 L50 70 M50 25 L70 25 M50 45 L65 45"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案16: シンプルなシンボルマーク -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">16. Simple Symbol Mark (シンプルなシンボル)</h3>
		<p class="text-sm text-white/60">
			極めてシンプルなシンボルマーク。最小限の要素で最大のインパクトを表現。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Simple Symbol Mark Logo"
			>
				<title>Simple Symbol Mark</title>
				<circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="4"></circle>
				<path fill="currentColor" d="M50 30 L55 45 L50 50 L45 45 Z"></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Simple Symbol Mark Variant"
			>
				<title>Simple Symbol Mark Variant</title>
				<rect
					x="30"
					y="30"
					width="40"
					height="40"
					fill="none"
					stroke="currentColor"
					stroke-width="4"
				></rect>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					d="M50 30 L50 70 M30 50 L70 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案17: JF回路融合（好みベース） -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">17. JF Circuit Fusion (JF回路融合)</h3>
		<p class="text-sm text-white/60">
			好みの10番と13番を融合。JFを回路パターンに組み込んだ、テクノロジー感のあるデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="JF Circuit Fusion Logo"
			>
				<title>JF Circuit Fusion</title>
				<!-- J の回路パターン -->
				<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="20" y="62" width="12" height="8" fill="currentColor"></rect>
				<circle cx="30" cy="30" r="3" fill="currentColor"></circle>
				<circle cx="20" cy="66" r="3" fill="currentColor"></circle>
				<!-- F の回路パターン -->
				<rect x="45" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="45" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="45" y="45" width="20" height="8" fill="currentColor"></rect>
				<circle cx="70" cy="24" r="3" fill="currentColor"></circle>
				<circle cx="65" cy="49" r="3" fill="currentColor"></circle>
				<!-- 接続線 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					d="M28 30 L45 30 M30 66 L45 66"
					opacity="0.5"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="JF Circuit Fusion Variant"
			>
				<title>JF Circuit Fusion Variant</title>
				<!-- ストロークベースの回路JF -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M25 25 L25 70 Q25 80, 15 80 M25 25 L45 25 M45 25 L45 75 M45 25 L70 25 M45 50 L65 50"
				></path>
				<!-- ノード -->
				<circle cx="25" cy="25" r="4" fill="currentColor"></circle>
				<circle cx="45" cy="25" r="4" fill="currentColor"></circle>
				<circle cx="70" cy="25" r="4" fill="currentColor"></circle>
				<circle cx="65" cy="50" r="4" fill="currentColor"></circle>
				<circle cx="25" cy="70" r="4" fill="currentColor"></circle>
				<circle cx="15" cy="80" r="4" fill="currentColor"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案18: グリッドベースのJF構造 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">18. Grid-Based JF Structure (グリッドベース構造)</h3>
		<p class="text-sm text-white/60">
			グリッドシステム上に構築された、モジュラーで構造的なJFデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Grid-Based JF Structure Logo"
			>
				<title>Grid-Based JF Structure</title>
				<!-- グリッド線（薄く） -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="0.5"
					opacity="0.3"
					d="M20 20 L20 80 M30 20 L30 80 M40 20 L40 80 M50 20 L50 80 M60 20 L60 80 M70 20 L70 80 M20 20 L80 20 M20 30 L80 30 M20 40 L80 40 M20 50 L80 50 M20 60 L80 60 M20 70 L80 70"
				></path>
				<!-- J -->
				<rect x="20" y="20" width="8" height="8" fill="currentColor"></rect>
				<rect x="20" y="28" width="8" height="8" fill="currentColor"></rect>
				<rect x="20" y="36" width="8" height="8" fill="currentColor"></rect>
				<rect x="20" y="44" width="8" height="8" fill="currentColor"></rect>
				<rect x="20" y="52" width="8" height="8" fill="currentColor"></rect>
				<rect x="20" y="60" width="8" height="8" fill="currentColor"></rect>
				<rect x="20" y="68" width="12" height="8" fill="currentColor"></rect>
				<!-- F -->
				<rect x="40" y="20" width="8" height="8" fill="currentColor"></rect>
				<rect x="40" y="28" width="8" height="8" fill="currentColor"></rect>
				<rect x="40" y="36" width="8" height="8" fill="currentColor"></rect>
				<rect x="40" y="44" width="8" height="8" fill="currentColor"></rect>
				<rect x="40" y="52" width="8" height="8" fill="currentColor"></rect>
				<rect x="40" y="60" width="8" height="8" fill="currentColor"></rect>
				<rect x="40" y="68" width="8" height="8" fill="currentColor"></rect>
				<rect x="40" y="20" width="24" height="8" fill="currentColor"></rect>
				<rect x="40" y="44" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Grid-Based JF Structure Variant"
			>
				<title>Grid-Based JF Structure Variant</title>
				<!-- モジュラーなJF -->
				<rect x="20" y="20" width="12" height="12" fill="currentColor"></rect>
				<rect x="20" y="32" width="8" height="40" fill="currentColor"></rect>
				<rect x="20" y="72" width="16" height="8" fill="currentColor"></rect>
				<rect x="40" y="20" width="8" height="60" fill="currentColor"></rect>
				<rect x="40" y="20" width="28" height="12" fill="currentColor"></rect>
				<rect x="40" y="48" width="24" height="12" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案19: ノードネットワークJF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">19. Node Network JF (ノードネットワーク)</h3>
		<p class="text-sm text-white/60">ノードと接続線で構成された、ネットワーク構造のJFデザイン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Node Network JF Logo"
			>
				<title>Node Network JF</title>
				<!-- J のノード -->
				<circle cx="30" cy="25" r="5" fill="currentColor"></circle>
				<circle cx="30" cy="40" r="5" fill="currentColor"></circle>
				<circle cx="30" cy="55" r="5" fill="currentColor"></circle>
				<circle cx="30" cy="70" r="5" fill="currentColor"></circle>
				<circle cx="20" cy="75" r="5" fill="currentColor"></circle>
				<!-- F のノード -->
				<circle cx="60" cy="25" r="5" fill="currentColor"></circle>
				<circle cx="75" cy="25" r="5" fill="currentColor"></circle>
				<circle cx="60" cy="50" r="5" fill="currentColor"></circle>
				<circle cx="70" cy="50" r="5" fill="currentColor"></circle>
				<circle cx="60" cy="75" r="5" fill="currentColor"></circle>
				<!-- 接続線 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					d="M30 25 L30 40 L30 55 L30 70 L20 75 M60 25 L75 25 M60 25 L60 50 L70 50 M60 50 L60 75"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Node Network JF Variant"
			>
				<title>Node Network JF Variant</title>
				<!-- より複雑なネットワーク -->
				<circle cx="25" cy="20" r="4" fill="currentColor"></circle>
				<circle cx="25" cy="35" r="4" fill="currentColor"></circle>
				<circle cx="25" cy="50" r="4" fill="currentColor"></circle>
				<circle cx="25" cy="65" r="4" fill="currentColor"></circle>
				<circle cx="15" cy="70" r="4" fill="currentColor"></circle>
				<circle cx="55" cy="20" r="4" fill="currentColor"></circle>
				<circle cx="70" cy="20" r="4" fill="currentColor"></circle>
				<circle cx="55" cy="45" r="4" fill="currentColor"></circle>
				<circle cx="68" cy="45" r="4" fill="currentColor"></circle>
				<circle cx="55" cy="70" r="4" fill="currentColor"></circle>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					d="M25 20 L25 35 L25 50 L25 65 L15 70 M55 20 L70 20 M55 20 L55 45 L68 45 M55 45 L55 70 M25 50 L55 45"
					opacity="0.6"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案20: 幾何学的モジュールJF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">20. Geometric Module JF (幾何学的モジュール)</h3>
		<p class="text-sm text-white/60">
			幾何学的なモジュールを組み合わせて構築された、構造的なJFデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Geometric Module JF Logo"
			>
				<title>Geometric Module JF</title>
				<!-- J モジュール -->
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="24" y="28" width="8" height="40" fill="currentColor"></rect>
				<rect x="20" y="68" width="16" height="8" fill="currentColor"></rect>
				<rect x="20" y="68" width="8" height="12" fill="currentColor"></rect>
				<!-- F モジュール -->
				<rect x="50" y="20" width="8" height="60" fill="currentColor"></rect>
				<rect x="50" y="20" width="28" height="8" fill="currentColor"></rect>
				<rect x="50" y="48" width="24" height="8" fill="currentColor"></rect>
				<!-- 接続要素 -->
				<rect x="40" y="48" width="10" height="4" fill="currentColor" opacity="0.5"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Geometric Module JF Variant"
			>
				<title>Geometric Module JF Variant</title>
				<!-- ストロークベースのモジュール -->
				<rect x="20" y="20" width="20" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="24" y="28" width="8" height="40" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="20" y="68" width="16" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="20" y="68" width="8" height="12" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="50" y="20" width="8" height="60" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="50" y="20" width="28" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="50" y="48" width="24" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
			</svg>
		</div>
	</div>

	<!-- 提案21: テクノロジー回路JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">21. Tech Circuit JF (テクノロジー回路JF)</h3>
		<p class="text-sm text-white/60">回路ボードをイメージした、より複雑な構造のJFデザイン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Tech Circuit JF Logo"
			>
				<title>Tech Circuit JF</title>
				<!-- 基盤の枠 -->
				<rect
					x="15"
					y="15"
					width="70"
					height="70"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					opacity="0.4"
				></rect>
				<!-- J の回路 -->
				<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="20" y="62" width="12" height="8" fill="currentColor"></rect>
				<circle cx="30" cy="30" r="3" fill="currentColor"></circle>
				<circle cx="20" cy="66" r="3" fill="currentColor"></circle>
				<!-- F の回路 -->
				<rect x="45" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="45" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="45" y="45" width="20" height="8" fill="currentColor"></rect>
				<circle cx="70" cy="24" r="3" fill="currentColor"></circle>
				<circle cx="65" cy="49" r="3" fill="currentColor"></circle>
				<circle cx="45" cy="75" r="3" fill="currentColor"></circle>
				<!-- 接続パス -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					d="M28 30 L45 30 M30 66 L45 66"
					opacity="0.4"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Tech Circuit JF Variant"
			>
				<title>Tech Circuit JF Variant</title>
				<!-- より複雑な回路パターン -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					d="M25 25 L25 70 Q25 80, 15 80 M25 25 L45 25 M45 25 L45 75 M45 25 L70 25 M45 50 L65 50"
				></path>
				<!-- ノード -->
				<circle cx="25" cy="25" r="4" fill="currentColor"></circle>
				<circle cx="45" cy="25" r="4" fill="currentColor"></circle>
				<circle cx="70" cy="25" r="4" fill="currentColor"></circle>
				<circle cx="65" cy="50" r="4" fill="currentColor"></circle>
				<circle cx="45" cy="50" r="4" fill="currentColor"></circle>
				<circle cx="25" cy="70" r="4" fill="currentColor"></circle>
				<circle cx="15" cy="80" r="4" fill="currentColor"></circle>
				<!-- 追加の接続線 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					d="M25 25 L45 50 M70 25 L65 50"
					opacity="0.3"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案22: 構造化されたJFアーキテクチャ -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">22. Structured JF Architecture (構造化アーキテクチャ)</h3>
		<p class="text-sm text-white/60">
			アーキテクチャ図をイメージした、階層的で構造的なJFデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Structured JF Architecture Logo"
			>
				<title>Structured JF Architecture</title>
				<!-- J の階層構造 -->
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="24" y="32" width="8" height="8" fill="currentColor"></rect>
				<rect x="24" y="44" width="8" height="8" fill="currentColor"></rect>
				<rect x="24" y="56" width="8" height="8" fill="currentColor"></rect>
				<rect x="20" y="68" width="16" height="8" fill="currentColor"></rect>
				<rect x="20" y="68" width="8" height="12" fill="currentColor"></rect>
				<!-- F の階層構造 -->
				<rect x="50" y="20" width="8" height="60" fill="currentColor"></rect>
				<rect x="50" y="20" width="28" height="8" fill="currentColor"></rect>
				<rect x="50" y="44" width="24" height="8" fill="currentColor"></rect>
				<!-- 接続線 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					d="M30 28 L30 32 M30 40 L30 44 M30 52 L30 56 M30 64 L30 68"
					opacity="0.5"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Structured JF Architecture Variant"
			>
				<title>Structured JF Architecture Variant</title>
				<!-- ボックス化された構造 -->
				<rect x="20" y="20" width="20" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="24" y="32" width="8" height="40" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="20" y="72" width="16" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="20" y="72" width="8" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="50" y="20" width="8" height="60" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="50" y="20" width="28" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="50" y="48" width="24" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
			</svg>
		</div>
	</div>

	<!-- 提案23: ピクセルアート風JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">23. Pixel Art JF (ピクセルアート風)</h3>
		<p class="text-sm text-white/60">
			ピクセルアートのスタイルで表現した、レトロフューチャーなJFデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Pixel Art JF Logo"
			>
				<title>Pixel Art JF</title>
				<!-- J ピクセル -->
				<rect x="20" y="20" width="6" height="6" fill="currentColor"></rect>
				<rect x="26" y="20" width="6" height="6" fill="currentColor"></rect>
				<rect x="32" y="20" width="6" height="6" fill="currentColor"></rect>
				<rect x="26" y="26" width="6" height="6" fill="currentColor"></rect>
				<rect x="26" y="32" width="6" height="6" fill="currentColor"></rect>
				<rect x="26" y="38" width="6" height="6" fill="currentColor"></rect>
				<rect x="26" y="44" width="6" height="6" fill="currentColor"></rect>
				<rect x="26" y="50" width="6" height="6" fill="currentColor"></rect>
				<rect x="20" y="56" width="6" height="6" fill="currentColor"></rect>
				<rect x="26" y="56" width="6" height="6" fill="currentColor"></rect>
				<rect x="14" y="62" width="6" height="6" fill="currentColor"></rect>
				<!-- F ピクセル -->
				<rect x="44" y="20" width="6" height="6" fill="currentColor"></rect>
				<rect x="50" y="20" width="6" height="6" fill="currentColor"></rect>
				<rect x="56" y="20" width="6" height="6" fill="currentColor"></rect>
				<rect x="62" y="20" width="6" height="6" fill="currentColor"></rect>
				<rect x="44" y="26" width="6" height="6" fill="currentColor"></rect>
				<rect x="44" y="32" width="6" height="6" fill="currentColor"></rect>
				<rect x="44" y="38" width="6" height="6" fill="currentColor"></rect>
				<rect x="44" y="44" width="6" height="6" fill="currentColor"></rect>
				<rect x="50" y="44" width="6" height="6" fill="currentColor"></rect>
				<rect x="56" y="44" width="6" height="6" fill="currentColor"></rect>
				<rect x="44" y="50" width="6" height="6" fill="currentColor"></rect>
				<rect x="44" y="56" width="6" height="6" fill="currentColor"></rect>
				<rect x="44" y="62" width="6" height="6" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Pixel Art JF Variant"
			>
				<title>Pixel Art JF Variant</title>
				<!-- より大きなピクセル -->
				<rect x="18" y="18" width="8" height="8" fill="currentColor"></rect>
				<rect x="26" y="18" width="8" height="8" fill="currentColor"></rect>
				<rect x="34" y="18" width="8" height="8" fill="currentColor"></rect>
				<rect x="26" y="26" width="8" height="8" fill="currentColor"></rect>
				<rect x="26" y="34" width="8" height="8" fill="currentColor"></rect>
				<rect x="26" y="42" width="8" height="8" fill="currentColor"></rect>
				<rect x="26" y="50" width="8" height="8" fill="currentColor"></rect>
				<rect x="18" y="58" width="8" height="8" fill="currentColor"></rect>
				<rect x="26" y="58" width="8" height="8" fill="currentColor"></rect>
				<rect x="10" y="66" width="8" height="8" fill="currentColor"></rect>
				<rect x="50" y="18" width="8" height="8" fill="currentColor"></rect>
				<rect x="58" y="18" width="8" height="8" fill="currentColor"></rect>
				<rect x="66" y="18" width="8" height="8" fill="currentColor"></rect>
				<rect x="50" y="26" width="8" height="8" fill="currentColor"></rect>
				<rect x="50" y="34" width="8" height="8" fill="currentColor"></rect>
				<rect x="50" y="42" width="8" height="8" fill="currentColor"></rect>
				<rect x="58" y="42" width="8" height="8" fill="currentColor"></rect>
				<rect x="66" y="42" width="8" height="8" fill="currentColor"></rect>
				<rect x="50" y="50" width="8" height="8" fill="currentColor"></rect>
				<rect x="50" y="58" width="8" height="8" fill="currentColor"></rect>
				<rect x="50" y="66" width="8" height="8" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案24: モダンな線形JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">24. Modern Linear JF (モダンな線形)</h3>
		<p class="text-sm text-white/60">
			線のみで構成された、クリーンでモダンなJFデザイン。構造的で洗練された印象。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Modern Linear JF Logo"
			>
				<title>Modern Linear JF</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M25 25 L25 70 Q25 80, 15 80 M25 25 L40 25 M50 25 L50 80 M50 25 L75 25 M50 50 L70 50"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Modern Linear JF Variant"
			>
				<title>Modern Linear JF Variant</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M20 20 L20 75 Q20 85, 10 85 M20 20 L38 20 M45 20 L45 85 M45 20 L72 20 M45 48 L68 48"
				></path>
				<!-- 装飾的なノード -->
				<circle cx="20" cy="20" r="2" fill="currentColor"></circle>
				<circle cx="45" cy="20" r="2" fill="currentColor"></circle>
				<circle cx="72" cy="20" r="2" fill="currentColor"></circle>
				<circle cx="68" cy="48" r="2" fill="currentColor"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案25: ハイブリッド構造JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">25. Hybrid Structure JF (ハイブリッド構造)</h3>
		<p class="text-sm text-white/60">
			矩形と円、線を組み合わせた、ハイブリッドな構造のJFデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Hybrid Structure JF Logo"
			>
				<title>Hybrid Structure JF</title>
				<!-- J: 矩形と円の組み合わせ -->
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="26" y="28" width="8" height="40" fill="currentColor"></rect>
				<circle cx="30" cy="68" r="8" fill="currentColor"></circle>
				<!-- F: 矩形と円の組み合わせ -->
				<rect x="50" y="20" width="8" height="60" fill="currentColor"></rect>
				<rect x="50" y="20" width="28" height="8" fill="currentColor"></rect>
				<rect x="50" y="48" width="24" height="8" fill="currentColor"></rect>
				<circle cx="74" cy="24" r="4" fill="currentColor"></circle>
				<circle cx="70" cy="52" r="4" fill="currentColor"></circle>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Hybrid Structure JF Variant"
			>
				<title>Hybrid Structure JF Variant</title>
				<!-- ストロークベースのハイブリッド -->
				<rect x="20" y="20" width="20" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="26" y="28" width="8" height="40" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<circle cx="30" cy="68" r="8" fill="none" stroke="currentColor" stroke-width="2"></circle>
				<rect x="50" y="20" width="8" height="60" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="50" y="20" width="28" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<rect x="50" y="48" width="24" height="8" fill="none" stroke="currentColor" stroke-width="2"
				></rect>
				<circle cx="74" cy="24" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle>
				<circle cx="70" cy="52" r="4" fill="none" stroke="currentColor" stroke-width="2"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案26: ミニマル回路JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">26. Minimal Circuit JF (ミニマル回路)</h3>
		<p class="text-sm text-white/60">最小限の要素で構成された、エレガントな回路風JFデザイン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Minimal Circuit JF Logo"
			>
				<title>Minimal Circuit JF</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					d="M25 25 L25 70 Q25 80, 15 80 M25 25 L42 25 M50 25 L50 80 M50 25 L72 25 M50 50 L68 50"
				></path>
				<circle cx="25" cy="25" r="3" fill="currentColor"></circle>
				<circle cx="50" cy="25" r="3" fill="currentColor"></circle>
				<circle cx="72" cy="25" r="3" fill="currentColor"></circle>
				<circle cx="68" cy="50" r="3" fill="currentColor"></circle>
				<circle cx="25" cy="70" r="3" fill="currentColor"></circle>
				<circle cx="15" cy="80" r="3" fill="currentColor"></circle>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Minimal Circuit JF Variant"
			>
				<title>Minimal Circuit JF Variant</title>
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					d="M22 22 L22 72 Q22 82, 12 82 M22 22 L40 22 M48 22 L48 82 M48 22 L70 22 M48 52 L66 52"
				></path>
				<circle cx="22" cy="22" r="2.5" fill="currentColor"></circle>
				<circle cx="48" cy="22" r="2.5" fill="currentColor"></circle>
				<circle cx="70" cy="22" r="2.5" fill="currentColor"></circle>
				<circle cx="66" cy="52" r="2.5" fill="currentColor"></circle>
				<circle cx="22" cy="72" r="2.5" fill="currentColor"></circle>
				<circle cx="12" cy="82" r="2.5" fill="currentColor"></circle>
			</svg>
		</div>
	</div>

	<!-- 提案27: 統合されたJF文字（好みベース） -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">27. Unified JF Character (統合されたJF文字)</h3>
		<p class="text-sm text-white/60">
			JとFが完全に統合され、一つの文字として機能するシンプルなデザイン。10番の好みを反映。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Unified JF Character Logo"
			>
				<title>Unified JF Character</title>
				<!-- 統合されたJF：Jの縦線とFの縦線が共有 -->
				<rect x="30" y="20" width="8" height="60" fill="currentColor"></rect>
				<!-- Jの上の横線 -->
				<rect x="20" y="20" width="18" height="8" fill="currentColor"></rect>
				<!-- Jの下のフック -->
				<rect x="20" y="72" width="18" height="8" fill="currentColor"></rect>
				<rect x="20" y="72" width="8" height="8" fill="currentColor"></rect>
				<!-- Fの上の横線（Jと共有） -->
				<rect x="30" y="20" width="25" height="8" fill="currentColor"></rect>
				<!-- Fの中間の横線 -->
				<rect x="30" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Unified JF Character Variant"
			>
				<title>Unified JF Character Variant</title>
				<!-- ストローク版：より統合された印象 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M25 25 L25 75 Q25 85, 15 85 M25 25 L45 25 M45 25 L45 75 M45 25 L70 25 M45 50 L65 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案28: シンプル統合JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">28. Simple Unified JF (シンプル統合JF)</h3>
		<p class="text-sm text-white/60">最小限の要素でJとFを統合した、極めてシンプルなデザイン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Simple Unified JF Logo"
			>
				<title>Simple Unified JF</title>
				<!-- 共有された縦線 -->
				<rect x="35" y="20" width="6" height="60" fill="currentColor"></rect>
				<!-- Jの要素 -->
				<rect x="25" y="20" width="16" height="6" fill="currentColor"></rect>
				<rect x="25" y="74" width="16" height="6" fill="currentColor"></rect>
				<rect x="25" y="74" width="6" height="6" fill="currentColor"></rect>
				<!-- Fの要素 -->
				<rect x="35" y="20" width="20" height="6" fill="currentColor"></rect>
				<rect x="35" y="47" width="16" height="6" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Simple Unified JF Variant"
			>
				<title>Simple Unified JF Variant</title>
				<!-- より細い線で統合 -->
				<rect x="32" y="22" width="4" height="56" fill="currentColor"></rect>
				<rect x="22" y="22" width="14" height="4" fill="currentColor"></rect>
				<rect x="22" y="74" width="14" height="4" fill="currentColor"></rect>
				<rect x="22" y="74" width="4" height="4" fill="currentColor"></rect>
				<rect x="32" y="22" width="22" height="4" fill="currentColor"></rect>
				<rect x="32" y="48" width="18" height="4" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案29: モノリシックJF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">29. Monolithic JF (モノリシックJF)</h3>
		<p class="text-sm text-white/60">一つの塊として統合された、シンプルで力強いJFデザイン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Monolithic JF Logo"
			>
				<title>Monolithic JF</title>
				<!-- 一つの統合された形状 -->
				<path
					fill="currentColor"
					d="M25 20 L45 20 L45 28 L33 28 L33 47 L45 47 L45 55 L33 55 L33 72 L25 72 L25 20 Z M45 20 L70 20 L70 28 L45 28 Z M45 47 L65 47 L65 55 L45 55 Z"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Monolithic JF Variant"
			>
				<title>Monolithic JF Variant</title>
				<!-- ストローク版のモノリシック -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M25 25 L25 75 Q25 85, 15 85 M25 25 L45 25 M45 25 L45 75 M45 25 L70 25 M45 50 L65 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案30: 融合JF文字 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">30. Fused JF Letter (融合JF文字)</h3>
		<p class="text-sm text-white/60">JとFが完全に融合し、一つの文字として認識されるデザイン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Fused JF Letter Logo"
			>
				<title>Fused JF Letter</title>
				<!-- 完全に融合したJF -->
				<rect x="28" y="20" width="8" height="60" fill="currentColor"></rect>
				<!-- Jの上の横線 -->
				<rect x="20" y="20" width="16" height="8" fill="currentColor"></rect>
				<!-- Jの下のフック -->
				<rect x="20" y="72" width="16" height="8" fill="currentColor"></rect>
				<rect x="20" y="72" width="8" height="8" fill="currentColor"></rect>
				<!-- Fの上の横線（Jと統合） -->
				<rect x="28" y="20" width="28" height="8" fill="currentColor"></rect>
				<!-- Fの中間の横線 -->
				<rect x="28" y="46" width="24" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Fused JF Letter Variant"
			>
				<title>Fused JF Letter Variant</title>
				<!-- より統合されたバージョン -->
				<rect x="30" y="20" width="6" height="60" fill="currentColor"></rect>
				<rect x="22" y="20" width="14" height="6" fill="currentColor"></rect>
				<rect x="22" y="74" width="14" height="6" fill="currentColor"></rect>
				<rect x="22" y="74" width="6" height="6" fill="currentColor"></rect>
				<rect x="30" y="20" width="26" height="6" fill="currentColor"></rect>
				<rect x="30" y="48" width="22" height="6" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案31: シームレス統合JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">31. Seamless Unified JF (シームレス統合JF)</h3>
		<p class="text-sm text-white/60">
			継ぎ目のない、完全に統合されたJFデザイン。一つの文字として自然に見える。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Seamless Unified JF Logo"
			>
				<title>Seamless Unified JF</title>
				<!-- シームレスに統合 -->
				<path
					fill="currentColor"
					d="M22 20 L40 20 L40 28 L30 28 L30 48 L50 48 L50 56 L30 56 L30 72 L22 72 L22 20 Z M40 20 L68 20 L68 28 L40 28 Z"
				></path>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Seamless Unified JF Variant"
			>
				<title>Seamless Unified JF Variant</title>
				<!-- ストローク版のシームレス統合 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M25 25 L25 75 Q25 85, 15 85 M25 25 L45 25 M45 25 L45 75 M45 25 L70 25 M45 50 L65 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案32: ミニマル統合JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">32. Minimal Unified JF (ミニマル統合JF)</h3>
		<p class="text-sm text-white/60">最小限の要素でJとFを統合した、極めてシンプルなデザイン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Minimal Unified JF Logo"
			>
				<title>Minimal Unified JF</title>
				<!-- 最小限の要素で統合 -->
				<rect x="32" y="20" width="5" height="60" fill="currentColor"></rect>
				<rect x="24" y="20" width="13" height="5" fill="currentColor"></rect>
				<rect x="24" y="75" width="13" height="5" fill="currentColor"></rect>
				<rect x="24" y="75" width="5" height="5" fill="currentColor"></rect>
				<rect x="32" y="20" width="24" height="5" fill="currentColor"></rect>
				<rect x="32" y="49" width="20" height="5" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Minimal Unified JF Variant"
			>
				<title>Minimal Unified JF Variant</title>
				<!-- より細い線でミニマルに -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M28 25 L28 75 Q28 85, 18 85 M28 25 L42 25 M42 25 L42 75 M42 25 L68 25 M42 50 L63 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案33: コンパクト統合JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">33. Compact Unified JF (コンパクト統合JF)</h3>
		<p class="text-sm text-white/60">
			コンパクトに統合された、密度の高いJFデザイン。一つの文字として機能。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Compact Unified JF Logo"
			>
				<title>Compact Unified JF</title>
				<!-- コンパクトに統合 -->
				<rect x="30" y="22" width="7" height="56" fill="currentColor"></rect>
				<rect x="22" y="22" width="15" height="6" fill="currentColor"></rect>
				<rect x="22" y="72" width="15" height="6" fill="currentColor"></rect>
				<rect x="22" y="72" width="6" height="6" fill="currentColor"></rect>
				<rect x="30" y="22" width="26" height="6" fill="currentColor"></rect>
				<rect x="30" y="47" width="22" height="6" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Compact Unified JF Variant"
			>
				<title>Compact Unified JF Variant</title>
				<!-- ストローク版のコンパクト統合 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M26 26 L26 74 Q26 84, 16 84 M26 26 L44 26 M44 26 L44 74 M44 26 L69 26 M44 49 L64 49"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案34: エレガント統合JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">34. Elegant Unified JF (エレガント統合JF)</h3>
		<p class="text-sm text-white/60">
			エレガントに統合された、洗練されたJFデザイン。一つの文字として美しく機能。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Elegant Unified JF Logo"
			>
				<title>Elegant Unified JF</title>
				<!-- エレガントに統合 -->
				<rect x="31" y="21" width="6" height="58" fill="currentColor"></rect>
				<rect x="23" y="21" width="14" height="6" fill="currentColor"></rect>
				<rect x="23" y="73" width="14" height="6" fill="currentColor"></rect>
				<rect x="23" y="73" width="6" height="6" fill="currentColor"></rect>
				<rect x="31" y="21" width="27" height="6" fill="currentColor"></rect>
				<rect x="31" y="48" width="23" height="6" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Elegant Unified JF Variant"
			>
				<title>Elegant Unified JF Variant</title>
				<!-- よりエレガントなストローク版 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M27 27 L27 73 Q27 83, 17 83 M27 27 L43 27 M43 27 L43 73 M43 27 L68 27 M43 50 L63 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案35: クリーン統合JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">35. Clean Unified JF (クリーン統合JF)</h3>
		<p class="text-sm text-white/60">
			クリーンでシンプルな統合JFデザイン。一つの文字として明確に機能。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Clean Unified JF Logo"
			>
				<title>Clean Unified JF</title>
				<!-- クリーンに統合 -->
				<rect x="29" y="20" width="8" height="60" fill="currentColor"></rect>
				<rect x="21" y="20" width="16" height="8" fill="currentColor"></rect>
				<rect x="21" y="72" width="16" height="8" fill="currentColor"></rect>
				<rect x="21" y="72" width="8" height="8" fill="currentColor"></rect>
				<rect x="29" y="20" width="28" height="8" fill="currentColor"></rect>
				<rect x="29" y="46" width="24" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Clean Unified JF Variant"
			>
				<title>Clean Unified JF Variant</title>
				<!-- ストローク版のクリーン統合 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M24 24 L24 74 Q24 84, 14 84 M24 24 L44 24 M44 24 L44 74 M44 24 L70 24 M44 48 L64 48"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案36: パーフェクト統合JF -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">36. Perfect Unified JF (パーフェクト統合JF)</h3>
		<p class="text-sm text-white/60">
			JとFが完璧に統合され、一つの文字として完璧に機能するデザイン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Perfect Unified JF Logo"
			>
				<title>Perfect Unified JF</title>
				<!-- 完璧に統合 -->
				<rect x="30" y="20" width="7" height="60" fill="currentColor"></rect>
				<rect x="22" y="20" width="15" height="7" fill="currentColor"></rect>
				<rect x="22" y="73" width="15" height="7" fill="currentColor"></rect>
				<rect x="22" y="73" width="7" height="7" fill="currentColor"></rect>
				<rect x="30" y="20" width="27" height="7" fill="currentColor"></rect>
				<rect x="30" y="46.5" width="23" height="7" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="Perfect Unified JF Variant"
			>
				<title>Perfect Unified JF Variant</title>
				<!-- ストローク版の完璧な統合 -->
				<path
					fill="none"
					stroke="currentColor"
					stroke-width="3.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M25 25 L25 75 Q25 85, 15 85 M25 25 L45 25 M45 25 L45 75 M45 25 L70 25 M45 50 L65 50"
				></path>
			</svg>
		</div>
	</div>

	<!-- 提案37: 10番派生1 - 太めの線 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">37. 10番派生1 - Bold Lines (太めの線)</h3>
		<p class="text-sm text-white/60">10番の1つ目のロゴをベースに、線を太くした力強いバージョン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生1 - Bold Lines Logo"
			>
				<title>10番派生1 - Bold Lines</title>
				<!-- J の要素（太め） -->
				<rect x="20" y="20" width="10" height="50" fill="currentColor"></rect>
				<rect x="20" y="20" width="22" height="10" fill="currentColor"></rect>
				<rect x="20" y="60" width="14" height="10" fill="currentColor"></rect>
				<!-- F の要素（太め） -->
				<rect x="42" y="20" width="10" height="55" fill="currentColor"></rect>
				<rect x="42" y="20" width="27" height="10" fill="currentColor"></rect>
				<rect x="42" y="43" width="22" height="10" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生1 - Bold Lines Variant"
			>
				<title>10番派生1 - Bold Lines Variant</title>
				<!-- さらに太め -->
				<rect x="18" y="18" width="12" height="52" fill="currentColor"></rect>
				<rect x="18" y="18" width="24" height="12" fill="currentColor"></rect>
				<rect x="18" y="58" width="16" height="12" fill="currentColor"></rect>
				<rect x="40" y="18" width="12" height="58" fill="currentColor"></rect>
				<rect x="40" y="18" width="30" height="12" fill="currentColor"></rect>
				<rect x="40" y="42" width="26" height="12" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案38: 10番派生2 - 細めの線 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">38. 10番派生2 - Thin Lines (細めの線)</h3>
		<p class="text-sm text-white/60">10番の1つ目のロゴをベースに、線を細くした繊細なバージョン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生2 - Thin Lines Logo"
			>
				<title>10番派生2 - Thin Lines</title>
				<!-- J の要素（細め） -->
				<rect x="22" y="22" width="5" height="48" fill="currentColor"></rect>
				<rect x="22" y="22" width="16" height="5" fill="currentColor"></rect>
				<rect x="22" y="65" width="10" height="5" fill="currentColor"></rect>
				<!-- F の要素（細め） -->
				<rect x="42" y="22" width="5" height="53" fill="currentColor"></rect>
				<rect x="42" y="22" width="22" height="5" fill="currentColor"></rect>
				<rect x="42" y="47" width="18" height="5" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生2 - Thin Lines Variant"
			>
				<title>10番派生2 - Thin Lines Variant</title>
				<!-- さらに細め -->
				<rect x="23" y="23" width="4" height="46" fill="currentColor"></rect>
				<rect x="23" y="23" width="14" height="4" fill="currentColor"></rect>
				<rect x="23" y="69" width="8" height="4" fill="currentColor"></rect>
				<rect x="43" y="23" width="4" height="51" fill="currentColor"></rect>
				<rect x="43" y="23" width="20" height="4" fill="currentColor"></rect>
				<rect x="43" y="48" width="16" height="4" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案39: 10番派生3 - 間隔を詰めた -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">39. 10番派生3 - Compact Spacing (間隔を詰めた)</h3>
		<p class="text-sm text-white/60">
			10番の1つ目のロゴをベースに、JとFの間隔を詰めたコンパクトなバージョン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生3 - Compact Spacing Logo"
			>
				<title>10番派生3 - Compact Spacing</title>
				<!-- J の要素 -->
				<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="20" y="62" width="12" height="8" fill="currentColor"></rect>
				<!-- F の要素（間隔を詰めた） -->
				<rect x="36" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="36" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="36" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生3 - Compact Spacing Variant"
			>
				<title>10番派生3 - Compact Spacing Variant</title>
				<!-- さらに間隔を詰めた（JとFが重なる） -->
				<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="20" y="62" width="12" height="8" fill="currentColor"></rect>
				<rect x="32" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="32" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="32" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案40: 10番派生4 - 間隔を広げた -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">40. 10番派生4 - Wide Spacing (間隔を広げた)</h3>
		<p class="text-sm text-white/60">
			10番の1つ目のロゴをベースに、JとFの間隔を広げた余裕のあるバージョン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生4 - Wide Spacing Logo"
			>
				<title>10番派生4 - Wide Spacing</title>
				<!-- J の要素 -->
				<rect x="18" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="18" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="18" y="62" width="12" height="8" fill="currentColor"></rect>
				<!-- F の要素（間隔を広げた） -->
				<rect x="46" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="46" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="46" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生4 - Wide Spacing Variant"
			>
				<title>10番派生4 - Wide Spacing Variant</title>
				<!-- さらに間隔を広げた -->
				<rect x="15" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="15" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="15" y="62" width="12" height="8" fill="currentColor"></rect>
				<rect x="50" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="50" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="50" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案41: 10番派生5 - 角を丸くした -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">41. 10番派生5 - Rounded Corners (角を丸くした)</h3>
		<p class="text-sm text-white/60">
			10番の1つ目のロゴをベースに、角を丸くした柔らかい印象のバージョン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生5 - Rounded Corners Logo"
			>
				<title>10番派生5 - Rounded Corners</title>
				<!-- J の要素（角丸） -->
				<rect x="20" y="20" width="8" height="50" rx="2" fill="currentColor"></rect>
				<rect x="20" y="20" width="20" height="8" rx="2" fill="currentColor"></rect>
				<rect x="20" y="62" width="12" height="8" rx="2" fill="currentColor"></rect>
				<!-- F の要素（角丸） -->
				<rect x="40" y="20" width="8" height="55" rx="2" fill="currentColor"></rect>
				<rect x="40" y="20" width="25" height="8" rx="2" fill="currentColor"></rect>
				<rect x="40" y="45" width="20" height="8" rx="2" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生5 - Rounded Corners Variant"
			>
				<title>10番派生5 - Rounded Corners Variant</title>
				<!-- さらに角を丸く -->
				<rect x="20" y="20" width="8" height="50" rx="4" fill="currentColor"></rect>
				<rect x="20" y="20" width="20" height="8" rx="4" fill="currentColor"></rect>
				<rect x="20" y="62" width="12" height="8" rx="4" fill="currentColor"></rect>
				<rect x="40" y="20" width="8" height="55" rx="4" fill="currentColor"></rect>
				<rect x="40" y="20" width="25" height="8" rx="4" fill="currentColor"></rect>
				<rect x="40" y="45" width="20" height="8" rx="4" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案42: 10番派生6 - プロポーション調整 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">42. 10番派生6 - Adjusted Proportions (プロポーション調整)</h3>
		<p class="text-sm text-white/60">
			10番の1つ目のロゴをベースに、プロポーションを調整したバージョン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生6 - Adjusted Proportions Logo"
			>
				<title>10番派生6 - Adjusted Proportions</title>
				<!-- J の要素（プロポーション調整） -->
				<rect x="20" y="20" width="8" height="52" fill="currentColor"></rect>
				<rect x="20" y="20" width="18" height="8" fill="currentColor"></rect>
				<rect x="20" y="64" width="10" height="8" fill="currentColor"></rect>
				<!-- F の要素（プロポーション調整） -->
				<rect x="40" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="40" y="20" width="23" height="8" fill="currentColor"></rect>
				<rect x="40" y="46" width="18" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生6 - Adjusted Proportions Variant"
			>
				<title>10番派生6 - Adjusted Proportions Variant</title>
				<!-- さらにプロポーション調整 -->
				<rect x="20" y="20" width="8" height="48" fill="currentColor"></rect>
				<rect x="20" y="20" width="22" height="8" fill="currentColor"></rect>
				<rect x="20" y="60" width="14" height="8" fill="currentColor"></rect>
				<rect x="40" y="20" width="8" height="57" fill="currentColor"></rect>
				<rect x="40" y="20" width="27" height="8" fill="currentColor"></rect>
				<rect x="40" y="44" width="22" height="8" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案43: 10番派生7 - 中央揃え -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">43. 10番派生7 - Centered Alignment (中央揃え)</h3>
		<p class="text-sm text-white/60">
			10番の1つ目のロゴをベースに、全体を中央に配置したバージョン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生7 - Centered Alignment Logo"
			>
				<title>10番派生7 - Centered Alignment</title>
				<!-- J の要素（中央揃え） -->
				<rect x="21" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="21" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="21" y="62" width="12" height="8" fill="currentColor"></rect>
				<!-- F の要素（中央揃え） -->
				<rect x="39" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="39" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="39" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生7 - Centered Alignment Variant"
			>
				<title>10番派生7 - Centered Alignment Variant</title>
				<!-- さらに中央に配置 -->
				<rect x="22" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="22" y="20" width="20" height="8" fill="currentColor"></rect>
				<rect x="22" y="62" width="12" height="8" fill="currentColor"></rect>
				<rect x="38" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="38" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="38" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案44: 10番派生8 - 縦長 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">44. 10番派生8 - Taller Version (縦長)</h3>
		<p class="text-sm text-white/60">10番の1つ目のロゴをベースに、縦方向を伸ばしたバージョン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生8 - Taller Version Logo"
			>
				<title>10番派生8 - Taller Version</title>
				<!-- J の要素（縦長） -->
				<rect x="20" y="18" width="8" height="56" fill="currentColor"></rect>
				<rect x="20" y="18" width="20" height="8" fill="currentColor"></rect>
				<rect x="20" y="66" width="12" height="8" fill="currentColor"></rect>
				<!-- F の要素（縦長） -->
				<rect x="40" y="18" width="8" height="61" fill="currentColor"></rect>
				<rect x="40" y="18" width="25" height="8" fill="currentColor"></rect>
				<rect x="40" y="47" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生8 - Taller Version Variant"
			>
				<title>10番派生8 - Taller Version Variant</title>
				<!-- さらに縦長 -->
				<rect x="20" y="15" width="8" height="60" fill="currentColor"></rect>
				<rect x="20" y="15" width="20" height="8" fill="currentColor"></rect>
				<rect x="20" y="67" width="12" height="8" fill="currentColor"></rect>
				<rect x="40" y="15" width="8" height="65" fill="currentColor"></rect>
				<rect x="40" y="15" width="25" height="8" fill="currentColor"></rect>
				<rect x="40" y="48" width="20" height="8" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案45: 10番派生9 - 横長 -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">45. 10番派生9 - Wider Version (横長)</h3>
		<p class="text-sm text-white/60">10番の1つ目のロゴをベースに、横方向を広げたバージョン。</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生9 - Wider Version Logo"
			>
				<title>10番派生9 - Wider Version</title>
				<!-- J の要素（横長） -->
				<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="20" y="20" width="22" height="8" fill="currentColor"></rect>
				<rect x="20" y="62" width="14" height="8" fill="currentColor"></rect>
				<!-- F の要素（横長） -->
				<rect x="40" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="40" y="20" width="28" height="8" fill="currentColor"></rect>
				<rect x="40" y="45" width="23" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生9 - Wider Version Variant"
			>
				<title>10番派生9 - Wider Version Variant</title>
				<!-- さらに横長 -->
				<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
				<rect x="20" y="20" width="24" height="8" fill="currentColor"></rect>
				<rect x="20" y="62" width="16" height="8" fill="currentColor"></rect>
				<rect x="40" y="20" width="8" height="55" fill="currentColor"></rect>
				<rect x="40" y="20" width="30" height="8" fill="currentColor"></rect>
				<rect x="40" y="45" width="25" height="8" fill="currentColor"></rect>
			</svg>
		</div>
	</div>

	<!-- 提案46: 10番派生10 - 統合バージョン -->
	<div class="space-y-2">
		<h3 class="text-lg text-white/70">46. 10番派生10 - Unified Version (統合バージョン)</h3>
		<p class="text-sm text-white/60">
			10番の1つ目のロゴをベースに、JとFの縦線を統合したバージョン。
		</p>
		<div class="flex items-center gap-4">
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生10 - Unified Version Logo"
			>
				<title>10番派生10 - Unified Version</title>
				<!-- 統合された縦線 -->
				<rect x="30" y="20" width="8" height="55" fill="currentColor"></rect>
				<!-- J の要素 -->
				<rect x="20" y="20" width="18" height="8" fill="currentColor"></rect>
				<rect x="20" y="62" width="18" height="8" fill="currentColor"></rect>
				<!-- F の要素 -->
				<rect x="30" y="20" width="25" height="8" fill="currentColor"></rect>
				<rect x="30" y="45" width="20" height="8" fill="currentColor"></rect>
			</svg>
			<svg
				viewBox="0 0 100 100"
				width="80"
				height="80"
				class="text-white"
				aria-label="10番派生10 - Unified Version Variant"
			>
				<title>10番派生10 - Unified Version Variant</title>
				<!-- さらに統合されたバージョン -->
				<rect x="28" y="20" width="8" height="60" fill="currentColor"></rect>
				<rect x="20" y="20" width="16" height="8" fill="currentColor"></rect>
				<rect x="20" y="72" width="16" height="8" fill="currentColor"></rect>
				<rect x="28" y="20" width="28" height="8" fill="currentColor"></rect>
				<rect x="28" y="46" width="24" height="8" fill="currentColor"></rect>
			</svg>
		</div>
	</div>
</div>
