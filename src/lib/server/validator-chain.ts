type ValidationResult = Response | undefined
type ValidatorFunction = (request: Request, url: URL, ip: string) => ValidationResult

function run_validators(
	validators: ReadonlyArray<ValidatorFunction>,
	request: Request,
	url: URL,
	ip: string,
): ValidationResult {
	for (const validator of validators) {
		const result = validator(request, url, ip)

		if (result !== undefined) return result
	}

	return undefined
}

const validator_chain = { run_validators }

export type { ValidationResult, ValidatorFunction }
export { validator_chain }
