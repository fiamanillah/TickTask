import { BrowserRouter, Routes, Route } from 'react-router';
import App from '@/App';
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import PrivateRoute from '../components/PrivateRoute';

export default function MainRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route
                        index
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }
                    />
                </Route>
                <Route path="login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}
