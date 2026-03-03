<script lang="ts">
	import ExternalLink from '$lib/components/ExternalLink.svelte'
	import PageSection from '$lib/components/PageSection.svelte'
</script>

<PageSection title="Cookies and Tracking Technologies">
	<div class="space-y-4">
		<div>
			<h3 class="mb-2 text-xl font-medium">What Are Cookies?</h3>
			<p>
				Cookies are small text files stored on your device when you visit a website. They help
				websites remember your preferences and improve your browsing experience.
			</p>
		</div>

		<div>
			<h3 class="mb-2 text-xl font-medium">Types of Cookies We Use</h3>
			<ol class="ml-4 list-decimal space-y-1">
				<li>
					<strong>Essential Cookies</strong>: Required for the website to function properly
				</li>
				<li>
					<strong>Analytics Cookies</strong>: Help us understand how visitors interact with our
					website
				</li>
				<li>
					<strong>Advertising Cookies</strong>: Used to deliver relevant advertisements and track ad
					performance
				</li>
			</ol>
		</div>

		<div>
			<h3 class="mb-2 text-xl font-medium">Third-Party Cookies</h3>
			<p class="mb-2">We use third-party services that may set cookies on your device:</p>
			<ul class="ml-4 list-disc space-y-1">
				<li>
					<strong>Google AdSense</strong>: We use Google AdSense to display advertisements on our
					website. Google uses cookies to serve ads based on your prior visits to our website and
					other websites. You can learn more about how Google uses cookies by visiting
					<ExternalLink href="https://policies.google.com/privacy">
						Google's Privacy & Terms
					</ExternalLink>.
				</li>
			</ul>
		</div>

		<div>
			<h3 class="mb-2 text-xl font-medium">Managing Cookies</h3>
			<p class="mb-2">
				You can control and manage cookies through your browser settings. Most browsers allow you
				to:
			</p>
			<ul class="ml-4 list-disc space-y-1">
				<li>View and delete cookies</li>
				<li>Block cookies from specific sites</li>
				<li>Block all cookies</li>
				<li>Receive notifications when cookies are set</li>
			</ul>
			<p class="mt-2">
				Please note that blocking cookies may affect your ability to use certain features of our
				website.
			</p>
		</div>
	</div>
</PageSection>

<PageSection title="Google AdSense">
	<p class="mb-4">
		Our website uses Google AdSense, a service provided by Google LLC ("Google") for displaying
		advertisements. Google AdSense uses cookies and web beacons to:
	</p>
	<ul class="mb-4 ml-4 list-disc space-y-1">
		<li>Display personalized advertisements based on your interests</li>
		<li>Measure the effectiveness of advertisements</li>
		<li>Provide aggregated reports on ad performance</li>
	</ul>

	<div>
		<h3 class="mb-2 text-xl font-medium">Google's Use of Data</h3>
		<p class="mb-2">
			When you visit our website, Google may collect information about your visits to this and other
			websites to provide advertisements about goods and services that may interest you. Google's
			use of advertising cookies enables it and its partners to serve ads based on your visits to
			our site and/or other sites on the Internet.
		</p>
		<p class="mb-2">
			You may opt out of personalized advertising by visiting
			<ExternalLink href="https://www.google.com/settings/ads">Google's Ads Settings</ExternalLink>.
			Alternatively, you can opt out of third-party vendor's use of cookies for personalized
			advertising by visiting
			<ExternalLink href="http://www.aboutads.info/choices">www.aboutads.info/choices</ExternalLink
			>.
		</p>
		<p>
			For more information about Google's privacy practices, please visit
			<ExternalLink href="https://policies.google.com/privacy">Google's Privacy Policy</ExternalLink
			>.
		</p>
	</div>
</PageSection>
