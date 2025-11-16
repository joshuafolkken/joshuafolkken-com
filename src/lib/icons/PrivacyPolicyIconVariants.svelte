<!-- 
PrivacyPolicyIcon のデザイン候補集

各バリエーションをコピーして PrivacyPolicyIcon.svelte に適用できます。
-->

<!-- 候補1: シールドにチェックマーク（保護と承認） -->
<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Privacy Policy',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	role="img"
	aria-label={aria_label}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>{title}</title>
	<!-- Shield with checkmark -->
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
	<path d="M9 12l2 2 4-4"></path>
</svg>

<!-- 
候補2: 鍵アイコン（セキュリティとプライバシー）
<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Privacy Policy',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	role="img"
	aria-label={aria_label}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>{title}</title>
	<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
</svg>
-->

<!-- 
候補3: ロックアイコン（保護）
<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Privacy Policy',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	role="img"
	aria-label={aria_label}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>{title}</title>
	<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
	<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
</svg>
-->

<!-- 
候補4: ドキュメントアイコン（ポリシードキュメント）
<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Privacy Policy',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	role="img"
	aria-label={aria_label}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>{title}</title>
	<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
	<polyline points="14 2 14 8 20 8"></polyline>
	<line x1="16" y1="13" x2="8" y2="13"></line>
	<line x1="16" y1="17" x2="8" y2="17"></line>
	<polyline points="10 9 9 9 8 9"></polyline>
</svg>
-->

<!-- 
候補5: 目に斜線（プライバシー保護）
<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Privacy Policy',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	role="img"
	aria-label={aria_label}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>{title}</title>
	<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
	<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
	<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
	<line x1="2" y1="2" x2="22" y2="22"></line>
</svg>
-->

<!-- 
候補6: シールドに鍵（保護とセキュリティ）
<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Privacy Policy',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	role="img"
	aria-label={aria_label}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>{title}</title>
	<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
	<circle cx="12" cy="12" r="3"></circle>
	<path d="M12 1v3"></path>
	<path d="M12 21v-2"></path>
	<path d="M6 12H4"></path>
	<path d="M20 12h-2"></path>
</svg>
-->
