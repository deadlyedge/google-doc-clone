export type SessionClaimsType = {
	azp: string
	exp: number
	fva: number[]
	iat: number
	iss: string
	nbf: number
	o: {
		id: string
		rol: string
		slg: string
	}
	sid: string
	sub: string
	v: number
}
