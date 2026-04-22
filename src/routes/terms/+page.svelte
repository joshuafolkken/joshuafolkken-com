<script lang="ts">
	/* eslint-disable max-len */
	import { APP, AUTHOR, LAST_UPDATED } from '$lib/app'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import PageSection from '$lib/components/PageSection.svelte'
	import { LAST_UPDATED_CLASS, LINK_BASE_CLASS, LIST_DISC_CLASS } from '$lib/constants/layout'
	import { CONTACT_HREF, PRIVACY_HREF } from '$lib/constants/page-routes'
	import { PAGES } from '$lib/types/page'

	const last_updated = LAST_UPDATED.TERMS_OF_SERVICE
</script>

<svelte:head>
	<title>{PAGES.TERMS_OF_SERVICE.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={PAGES.TERMS_OF_SERVICE.description} />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.TERMS_OF_SERVICE} />

	<PageSection>
		<p class={LAST_UPDATED_CLASS}>Last Updated: {last_updated}</p>
	</PageSection>

	<PageSection title="Introduction">
		<p class="mt-4">
			These Terms of Service ("Terms") govern your access to and use of {APP.NAME} (the "Site"). By using
			the Site, you agree to these Terms. If you do not agree, please do not use the Site.
		</p>
		<p class="mt-2">
			For information on how we handle your data, please see our
			<a href={PRIVACY_HREF} class={LINK_BASE_CLASS}>Privacy Policy</a>.
		</p>
	</PageSection>

	<PageSection title="Acceptance of Terms">
		<p>
			By accessing or using the Site, you confirm that you are at least 13 years old and agree to be
			bound by these Terms and all applicable laws and regulations. If you are accessing the Site on
			behalf of an organization, you represent that you have authority to bind that organization to
			these Terms.
		</p>
	</PageSection>

	<PageSection title="Use of the Site">
		<p class="mb-2">
			You agree to use the Site only for lawful purposes. In particular, you agree not to:
		</p>
		<ul class={LIST_DISC_CLASS}>
			<li>Interfere with or disrupt the Site or its underlying infrastructure</li>
			<li>Attempt to gain unauthorized access to any portion of the Site</li>
			<li>
				Use automated means to scrape, harvest, or extract data in ways that impose unreasonable
				load
			</li>
			<li>Upload or transmit any malicious code or content</li>
			<li>Use the Site in any manner that could harm minors</li>
			<li>Violate any applicable law or the rights of any third party</li>
		</ul>
	</PageSection>

	<PageSection title="Intellectual Property">
		<p class="mb-2">
			Unless otherwise stated, all content on the Site — including text, graphics, logos, images,
			and the underlying code written by {AUTHOR.NAME} — is owned by or licensed to us and protected by
			copyright, trademark, and other intellectual property laws.
		</p>
		<p>
			Source code published as open source on repositories linked from the Site is governed by the
			license stated in each repository. You may not reproduce, distribute, or create derivative
			works from content on the Site except as expressly permitted by us or by applicable law (such
			as fair use).
		</p>
	</PageSection>

	<PageSection title="User-Submitted Content">
		<p class="mb-2">
			If you submit content to the Site — for example, comments, feedback, or messages — you
			represent that you own or have the right to submit that content, and that it does not violate
			the rights of any third party.
		</p>
		<p>
			By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use,
			reproduce, adapt, and display that content in connection with operating and improving the
			Site. You can revoke this license by asking us to remove your content via our
			<a href={CONTACT_HREF} class={LINK_BASE_CLASS}>Contact page</a>.
		</p>
	</PageSection>

	<PageSection title="Third-Party Links and Services">
		<p>
			The Site may contain links to third-party websites or services that are not owned or
			controlled by us. We are not responsible for the content, privacy practices, or availability
			of any third-party site or service. We encourage you to review the terms and privacy policies
			of any third party you interact with.
		</p>
	</PageSection>

	<PageSection title="Disclaimers">
		<p class="mb-2">
			The Site is provided "as is" and "as available," without warranties of any kind, either
			express or implied, including but not limited to warranties of merchantability, fitness for a
			particular purpose, non-infringement, or uninterrupted availability.
		</p>
		<p>
			We do not warrant that the Site will be error-free, secure, or free from viruses or other
			harmful components. You use the Site at your own risk.
		</p>
	</PageSection>

	<PageSection title="Limitation of Liability">
		<p>
			To the maximum extent permitted by applicable law, in no event will {AUTHOR.NAME} or any affiliated
			parties be liable for any indirect, incidental, special, consequential, or punitive damages, or
			any loss of profits, data, use, or goodwill, arising out of or in connection with your use of the
			Site, whether based in contract, tort, or any other legal theory, even if advised of the possibility
			of such damages.
		</p>
	</PageSection>

	<PageSection title="Modifications to the Site">
		<p>
			We reserve the right, at our sole discretion, to modify, suspend, or discontinue any part of
			the Site at any time, with or without notice. We will not be liable to you or to any third
			party for any modification, suspension, or discontinuance of the Site.
		</p>
	</PageSection>

	<PageSection title="Termination">
		<p>
			We may suspend or terminate your access to the Site at any time, with or without notice, for
			any conduct that we believe violates these Terms or is otherwise harmful to us, other users,
			or third parties. Sections that by their nature should survive termination will continue to
			apply after termination.
		</p>
	</PageSection>

	<PageSection title="Governing Law and Jurisdiction">
		<p>
			These Terms are governed by the laws of Japan, without regard to conflict-of-law principles.
			Any dispute arising out of or relating to these Terms or the Site will be subject to the
			exclusive jurisdiction of the courts located in Japan, except where mandatory consumer
			protection laws of your country of residence require otherwise.
		</p>
	</PageSection>

	<PageSection title="Changes to These Terms">
		<p class="mb-2">
			We may update these Terms from time to time to reflect changes in our practices or for other
			operational, legal, or regulatory reasons. When we make material changes, we will update the
			"Last Updated" date at the top of this page.
		</p>
		<p>
			Your continued use of the Site after changes take effect constitutes your acceptance of the
			revised Terms.
		</p>
	</PageSection>

	<PageSection title="Contact Us">
		<p>
			If you have questions about these Terms, please reach out via our
			<a href={CONTACT_HREF} class={LINK_BASE_CLASS}>Contact page</a>.
		</p>
	</PageSection>
</PageLayout>
