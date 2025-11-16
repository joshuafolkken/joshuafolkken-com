<script lang="ts">
	/* eslint-disable max-lines, max-len */
	import { APP, AUTHOR } from '$lib/app'
	import Divider from '$lib/components/Divider.svelte'
	import PageFooter from '$lib/components/PageFooter.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import PageSection from '$lib/components/PageSection.svelte'
	import { PAGES } from '$lib/types/page'

	const last_updated = 'November 2025'
</script>

<PageLayout max_width="2xl" padding="compact">
	<PageHeader page={PAGES.PRIVACY_POLICY} />

	<Divider />

	<PageSection>
		<p class="text-sm text-white/60">Last Updated: {last_updated}</p>
	</PageSection>

	<Divider />

	<PageSection title="Introduction">
		<p class="mt-4">
			Welcome to {APP.NAME} ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
			transparency about how we collect, use, and safeguard your information. This Privacy Policy explains
			our practices regarding data collection and usage when you visit our website.
		</p>
	</PageSection>

	<Divider />

	<PageSection title="Information We Collect">
		<div class="space-y-4">
			<div>
				<h3 class="mb-2 text-xl font-medium">Automatically Collected Information</h3>
				<p class="mb-2">
					When you visit our website, we may automatically collect certain information about your
					device and browsing behavior, including:
				</p>
				<ul class="ml-4 list-disc space-y-1">
					<li><strong>Device Information</strong>: Browser type, operating system, device type</li>
					<li>
						<strong>Usage Data</strong>: Pages visited, time spent on pages, click patterns,
						referring URLs
					</li>
					<li>
						<strong>IP Address</strong>: Your Internet Protocol address (which may be considered
						personal data in some jurisdictions)
					</li>
					<li>
						<strong>Cookies and Tracking Technologies</strong>: Information collected through
						cookies, web beacons, and similar technologies
					</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-2 text-xl font-medium">Information You Provide</h3>
				<p class="mb-2">We may collect information that you voluntarily provide to us, such as:</p>
				<ul class="ml-4 list-disc space-y-1">
					<li>Contact information when you reach out to us via email or contact forms</li>
					<li>Comments or feedback you submit</li>
					<li>Any other information you choose to share with us</li>
				</ul>
			</div>
		</div>
	</PageSection>

	<Divider />

	<PageSection title="How We Use Your Information">
		<p class="mb-2">We use the collected information for the following purposes:</p>
		<ol class="ml-4 list-decimal space-y-1">
			<li>
				<strong>Website Operation</strong>: To provide, maintain, and improve our website
				functionality
			</li>
			<li>
				<strong>Analytics</strong>: To understand how visitors use our website and to improve user
				experience
			</li>
			<li>
				<strong>Advertising</strong>: To display relevant advertisements through Google AdSense
			</li>
			<li>
				<strong>Communication</strong>: To respond to your inquiries and provide customer support
			</li>
			<li><strong>Legal Compliance</strong>: To comply with applicable laws and regulations</li>
		</ol>
	</PageSection>

	<Divider />

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
						<strong>Advertising Cookies</strong>: Used to deliver relevant advertisements and track
						ad performance
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
						<a
							href="https://policies.google.com/privacy"
							target="_blank"
							rel="noopener noreferrer"
							class="link-base text-white/80"
						>
							Google's Privacy & Terms
						</a>.
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

	<Divider />

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
				When you visit our website, Google may collect information about your visits to this and
				other websites to provide advertisements about goods and services that may interest you.
				Google's use of advertising cookies enables it and its partners to serve ads based on your
				visits to our site and/or other sites on the Internet.
			</p>
			<p class="mb-2">
				You may opt out of personalized advertising by visiting
				<a
					href="https://www.google.com/settings/ads"
					target="_blank"
					rel="noopener noreferrer"
					class="link-base text-white/80"
				>
					Google's Ads Settings
				</a>. Alternatively, you can opt out of third-party vendor's use of cookies for personalized
				advertising by visiting
				<a
					href="http://www.aboutads.info/choices"
					target="_blank"
					rel="noopener noreferrer"
					class="link-base text-white/80"
				>
					www.aboutads.info/choices
				</a>.
			</p>
			<p>
				For more information about Google's privacy practices, please visit
				<a
					href="https://policies.google.com/privacy"
					target="_blank"
					rel="noopener noreferrer"
					class="link-base text-white/80"
				>
					Google's Privacy Policy
				</a>.
			</p>
		</div>
	</PageSection>

	<Divider />

	<PageSection title="Third-Party Services">
		<p class="mb-2">
			We may use other third-party services that collect information about your use of our website:
		</p>
		<ul class="ml-4 list-disc space-y-1">
			<li><strong>Analytics Services</strong>: To analyze website traffic and user behavior</li>
			<li><strong>Content Delivery Networks</strong>: To deliver content efficiently</li>
			<li>
				<strong>Social Media Platforms</strong>: When you interact with social media features on our
				website
			</li>
		</ul>
		<p class="mt-2">
			These third-party services have their own privacy policies governing the collection and use of
			your information. We encourage you to review their privacy policies.
		</p>
	</PageSection>

	<Divider />

	<PageSection title="Data Sharing and Disclosure">
		<p class="mb-2">
			We do not sell your personal information. We may share your information in the following
			circumstances:
		</p>
		<ol class="ml-4 list-decimal space-y-1">
			<li>
				<strong>Service Providers</strong>: With third-party service providers who assist us in
				operating our website and conducting our business
			</li>
			<li>
				<strong>Legal Requirements</strong>: When required by law or to protect our rights and
				safety
			</li>
			<li>
				<strong>Business Transfers</strong>: In connection with a merger, acquisition, or sale of
				assets
			</li>
			<li>
				<strong>With Your Consent</strong>: When you have given us explicit permission to share your
				information
			</li>
		</ol>
	</PageSection>

	<Divider />

	<PageSection title="Data Security">
		<p>
			We implement appropriate technical and organizational measures to protect your personal
			information against unauthorized access, alteration, disclosure, or destruction. However, no
			method of transmission over the Internet or electronic storage is 100% secure, and we cannot
			guarantee absolute security.
		</p>
	</PageSection>

	<Divider />

	<PageSection title="Data Retention">
		<p>
			We retain your personal information only for as long as necessary to fulfill the purposes
			outlined in this Privacy Policy, unless a longer retention period is required or permitted by
			law.
		</p>
	</PageSection>

	<Divider />

	<PageSection title="Your Rights">
		<p class="mb-2">
			Depending on your location, you may have certain rights regarding your personal information,
			including:
		</p>
		<ul class="ml-4 list-disc space-y-1">
			<li>
				<strong>Access</strong>: The right to access the personal information we hold about you
			</li>
			<li>
				<strong>Correction</strong>: The right to correct inaccurate or incomplete information
			</li>
			<li>
				<strong>Deletion</strong>: The right to request deletion of your personal information
			</li>
			<li>
				<strong>Objection</strong>: The right to object to certain processing activities
			</li>
			<li>
				<strong>Portability</strong>: The right to receive your personal information in a structured
				format
			</li>
			<li>
				<strong>Withdrawal of Consent</strong>: The right to withdraw consent where processing is
				based on consent
			</li>
		</ul>
		<p class="mt-2">
			To exercise these rights, please contact us using the information provided in the "Contact Us"
			section below.
		</p>
	</PageSection>

	<Divider />

	<PageSection title="Children's Privacy">
		<p>
			Our website is not intended for children under the age of 13. We do not knowingly collect
			personal information from children under 13. If you are a parent or guardian and believe your
			child has provided us with personal information, please contact us immediately.
		</p>
	</PageSection>

	<Divider />

	<PageSection title="International Data Transfers">
		<p>
			Your information may be transferred to and processed in countries other than your country of
			residence. These countries may have data protection laws that differ from those in your
			country. By using our website, you consent to the transfer of your information to these
			countries.
		</p>
	</PageSection>

	<Divider />

	<PageSection title="Changes to This Privacy Policy">
		<p class="mb-2">
			We may update this Privacy Policy from time to time to reflect changes in our practices or for
			other operational, legal, or regulatory reasons. We will notify you of any material changes by
			posting the new Privacy Policy on this page and updating the "Last Updated" date.
		</p>
		<p>
			We encourage you to review this Privacy Policy periodically to stay informed about how we
			protect your information.
		</p>
	</PageSection>

	<Divider />

	<PageSection title="California Privacy Rights">
		<p class="mb-2">
			If you are a California resident, you have additional rights under the California Consumer
			Privacy Act (CCPA), including:
		</p>
		<ul class="ml-4 list-disc space-y-1">
			<li>The right to know what personal information is collected, used, shared, or sold</li>
			<li>The right to delete personal information held by businesses</li>
			<li>The right to opt-out of the sale of personal information</li>
			<li>The right to non-discrimination for exercising your privacy rights</li>
		</ul>
	</PageSection>

	<Divider />

	<PageSection title="European Privacy Rights">
		<p class="mb-2">
			If you are located in the European Economic Area (EEA), you have rights under the General Data
			Protection Regulation (GDPR), including:
		</p>
		<ul class="ml-4 list-disc space-y-1">
			<li>The right to access, rectify, or erase your personal data</li>
			<li>The right to restrict or object to processing</li>
			<li>The right to data portability</li>
			<li>The right to lodge a complaint with a supervisory authority</li>
		</ul>
	</PageSection>

	<Divider />

	<PageSection title="Contact Us">
		<p class="mb-2">
			If you have any questions, concerns, or requests regarding this Privacy Policy or our data
			practices, please contact us at:
		</p>
		<div class="space-y-1">
			<p>
				<strong>Email:</strong>
				{AUTHOR.EMAIL}
			</p>
			<p>
				<strong>Website:</strong>
				{APP.URL}
			</p>
		</div>
	</PageSection>

	<Divider />

	<PageFooter />
</PageLayout>
