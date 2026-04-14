function assemble(local: string, domain: string): string {
	return `${local}@${domain}`
}

function split(email: string): { local: string; domain: string } {
	const [local = '', domain = ''] = email.split('@')

	return { local, domain }
}

const email_utilities = {
	assemble,
	split,
}

export { email_utilities }
