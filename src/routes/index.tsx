import Dashboard from 'pages/dashboard';
import ErrorPage from 'pages/error-page';
import Login from 'pages/login';
import NewYouth from 'pages/new-youth';
import YouthDetails from 'pages/youth-details';
import DashboardTeacher from 'pages/dashboardTeacher';

import React from 'react';
import {
	BrowserRouter, Routes, Route, Navigate
} from 'react-router-dom';
import Statistics from 'pages/statistics';
import Users from 'pages/users';
import Summary from 'pages/summary';

type AppRouterTypes = {
	isLoggedIn?: boolean;
	setIsLoggedIn: (flag: boolean) => void;
};
export default function AppRouter({ isLoggedIn, setIsLoggedIn }: AppRouterTypes) {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					{
						!isLoggedIn ? (
							<>
								<Route index path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
								<Route path="*" element={<Navigate replace to="/login" />} />
								<Route path="/" element={<Navigate replace to="/login" />} />
							</>
							
						)
							: (
								<>
									<Route index path="dashboard" element={<Dashboard />} />
									<Route index path="dashboardTeacher" element={<DashboardTeacher />} />
									<Route path="/youthDetails/:id" element={<YouthDetails />} />
									<Route path="/newYouth" element={<NewYouth />} />
									<Route path="/statistics" element={<Statistics />} />
									<Route path="/users" element={<Users />} />
									<Route path="login" element={<Navigate replace to="/dashboard" />} />
									<Route path="/youthDetails" element={<Navigate replace to="/dashboard" />} />
									<Route path="/summary" element={<Summary />} />
									<Route path="/" element={<Navigate replace to="/login" />} />
									<Route path="*" element={<ErrorPage />} />
								</>
							)
					}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
