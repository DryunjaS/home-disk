import axios from "axios"

const $api = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_API_URL,
})

const $authApi = axios.create({
	baseURL: import.meta.env.VITE_REACT_APP_API_URL,
	withCredentials: true,
})

export { $api, $authApi }
