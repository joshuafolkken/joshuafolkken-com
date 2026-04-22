<script lang="ts">
	/* eslint-disable max-len */
	import { APP, AUTHOR, LAST_UPDATED } from '$lib/app'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import PageSection from '$lib/components/PageSection.svelte'
	import PrivacyPolicyTrackingSection from '$lib/components/privacy-policy/PrivacyPolicyTrackingSection.svelte'
	import {
		LAST_UPDATED_CLASS,
		LINK_BASE_CLASS,
		LIST_DECIMAL_CLASS,
		LIST_DISC_CLASS,
		SECTION_HEADING_3_CLASS,
	} from '$lib/constants/layout'
	import { CONTACT_HREF, TERMS_HREF } from '$lib/constants/page-routes'
	import { PAGES } from '$lib/types/page'

	const last_updated = LAST_UPDATED.PRIVACY_POLICY
</script>

<svelte:head>
	<title>{PAGES.PRIVACY_POLICY.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={PAGES.PRIVACY_POLICY.description} />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.PRIVACY_POLICY} />

	<PageSection>
		<p class={LAST_UPDATED_CLASS}>Last Updated: {last_updated}</p>
	</PageSection>

	<PageSection title="Introduction">
		<p class="mt-4">
			Welcome to {APP.NAME} ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
			transparency about how we collect, use, and safeguard your information. This Privacy Policy explains
			our practices regarding data collection and usage when you visit our website.
		</p>
		<p class="mt-2">
			For the rules governing your use of this website, please also review our
			<a href={TERMS_HREF} class={LINK_BASE_CLASS}>Terms of Service</a>.
		</p>
	</PageSection>

	<PageSection title="Information We Collect">
		<div class="space-y-4">
			<div>
				<h3 class={SECTION_HEADING_3_CLASS}>Automatically Collected Information</h3>
				<p class="mb-2">
					When you visit our website, we may automatically collect certain information about your
					device and browsing behavior, including:
				</p>
				<ul class={LIST_DISC_CLASS}>
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
				<h3 class={SECTION_HEADING_3_CLASS}>Information You Provide</h3>
				<p class="mb-2">We may collect information that you voluntarily provide to us, such as:</p>
				<ul class={LIST_DISC_CLASS}>
					<li>Contact information when you reach out to us via email or contact forms</li>
					<li>Comments or feedback you submit</li>
					<li>Any other information you choose to share with us</li>
				</ul>
			</div>
		</div>
	</PageSection>

	<PageSection title="How We Use Your Information">
		<p class="mb-2">We use the collected information for the following purposes:</p>
		<ol class={LIST_DECIMAL_CLASS}>
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

	<PrivacyPolicyTrackingSection />

	<PageSection title="Third-Party Services">
		<p class="mb-2">
			We may use other third-party services that collect information about your use of our website:
		</p>
		<ul class={LIST_DISC_CLASS}>
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

	<PageSection title="Data Sharing and Disclosure">
		<p class="mb-2">
			We do not sell your personal information. We may share your information in the following
			circumstances:
		</p>
		<ol class={LIST_DECIMAL_CLASS}>
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

	<PageSection title="Data Security">
		<p>
			We implement appropriate technical and organizational measures to protect your personal
			information against unauthorized access, alteration, disclosure, or destruction. However, no
			method of transmission over the Internet or electronic storage is 100% secure, and we cannot
			guarantee absolute security.
		</p>
	</PageSection>

	<PageSection title="Data Retention">
		<p>
			We retain your personal information only for as long as necessary to fulfill the purposes
			outlined in this Privacy Policy, unless a longer retention period is required or permitted by
			law.
		</p>
	</PageSection>

	<PageSection title="Your Rights">
		<p class="mb-2">
			Depending on your location, you may have certain rights regarding your personal information,
			including:
		</p>
		<ul class={LIST_DISC_CLASS}>
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
			To exercise these rights, please reach out via our
			<a href={CONTACT_HREF} class={LINK_BASE_CLASS}>Contact page</a>.
		</p>
	</PageSection>

	<PageSection title="Children's Privacy">
		<p>
			Our website is not intended for children under the age of 13. We do not knowingly collect
			personal information from children under 13. If you are a parent or guardian and believe your
			child has provided us with personal information, please contact us immediately.
		</p>
	</PageSection>

	<PageSection title="International Data Transfers">
		<p>
			Your information may be transferred to and processed in countries other than your country of
			residence. These countries may have data protection laws that differ from those in your
			country. By using our website, you consent to the transfer of your information to these
			countries.
		</p>
	</PageSection>

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

	<PageSection title="California Privacy Rights">
		<p class="mb-2">
			If you are a California resident, you have additional rights under the California Consumer
			Privacy Act (CCPA), including:
		</p>
		<ul class={LIST_DISC_CLASS}>
			<li>The right to know what personal information is collected, used, shared, or sold</li>
			<li>The right to delete personal information held by businesses</li>
			<li>The right to opt-out of the sale of personal information</li>
			<li>The right to non-discrimination for exercising your privacy rights</li>
		</ul>
	</PageSection>

	<PageSection title="European Privacy Rights">
		<p class="mb-2">
			If you are located in the European Economic Area (EEA), you have rights under the General Data
			Protection Regulation (GDPR), including:
		</p>
		<ul class={LIST_DISC_CLASS}>
			<li>The right to access, rectify, or erase your personal data</li>
			<li>The right to restrict or object to processing</li>
			<li>The right to data portability</li>
			<li>The right to lodge a complaint with a supervisory authority</li>
		</ul>
	</PageSection>

	<PageSection title="Contact Us">
		<p>
			If you have any questions, concerns, or requests regarding this Privacy Policy or our data
			practices, please reach out via our
			<a href={CONTACT_HREF} class={LINK_BASE_CLASS}>Contact page</a>.
		</p>
	</PageSection>
</PageLayout>
