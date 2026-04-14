import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../features/auth/context/AuthContext";
import MainPage from "./MainPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { DocumentationPage } from "../features/documentation/pages/DocumentationPage";

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route
						path="/documentation"
						element={<DocumentationPage />}
					/>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}
