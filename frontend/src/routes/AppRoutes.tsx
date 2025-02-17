import { useEffect } from "react"
import {
	useLocation,
	Route,
	Routes,
	useNavigate,
	Navigate,
} from "react-router-dom"
import { authRoutes, publicRoutes } from "./router"
import Cookies from "js-cookie"

function AppRoutes() {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		const isAuth = Cookies.get("isAuth") === "true"
		if (!isAuth && location.pathname !== "/") {
			navigate("/auth")
		}
	}, [Cookies.get("isAuth")])

	return (
		<Routes>
			{Cookies.get("isAuth") === "true" &&
				authRoutes.map(({ path, Component }) => (
					<Route key={path} path={path} element={<Component />} />
				))}
			{publicRoutes.map(({ path, Component }) => (
				<Route key={path} path={path} element={<Component />} />
			))}

			<Route path='*' element={<Navigate to='/auth' replace />} />
		</Routes>
	)
}

export default AppRoutes
