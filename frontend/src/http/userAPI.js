import { $authApi, $api } from "./index"
import { jwtDecode } from "jwt-decode"

const setCookie = (name, value, days) => {
	let expires = ""
	if (days) {
		const date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = "; expires=" + date.toUTCString()
	}
	document.cookie = name + "=" + value + expires + "; path=/"
}

const deleteCookie = (name) => {
	document.cookie = name + "=; Max-Age=0; path=/"
}

export const registration = async (name, password) => {
	await $api.post("api/auth/registration", {
		name,
		password,
	})
}

export const login = async (login, password) => {
	const { data } = await $api.post(
		"api/auth/login",
		{ login, password },
		{ withCredentials: true }
	)

	setCookie("role", data.role, 1)
	setCookie("userName", login, 1)

	return data
}

export const logout = async () => {
	deleteCookie("isAuth")
	deleteCookie("role")
	deleteCookie("userName")

	return
}

export const check = async () => {
	const { data } = await $authApi.get("api/auth/auth")
	return jwtDecode(data.token)
}
