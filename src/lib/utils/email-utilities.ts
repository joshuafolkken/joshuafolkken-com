const XOR_KEY = 5

function assemble(local: string, domain: string): string {
	return `${local}@${domain}`
}

function split(email: string): { local: string; domain: string } {
	const [local = '', domain = ''] = email.split('@')

	return { local, domain }
}

/* eslint-disable no-bitwise */
function encode_xor(text: string): ReadonlyArray<number> {
	return Array.from(text, (char) => (char.codePointAt(0) ?? 0) ^ XOR_KEY)
}

function decode_xor(encoded: ReadonlyArray<number>): string {
	return encoded.map((code) => String.fromCodePoint(code ^ XOR_KEY)).join('')
}
/* eslint-enable no-bitwise */

const email_utilities = {
	assemble,
	split,
	encode_xor,
	decode_xor,
}

export { email_utilities }
