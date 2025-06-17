import { SERVER_URL } from "../constants"

export const fetchSmsHistory = async () => {
	const response = await fetch(
		`${SERVER_URL}/api/history`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		}
	)
	return await response.json()
}

export interface SmsRequest {
	accountId: string
	phonenumber: string
	message: string
}

export const sendSms = async (request: SmsRequest) => {
	const response = await fetch(
		`${SERVER_URL}/api/sms/send`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request),
		}
	)
	return await response.json()
}
