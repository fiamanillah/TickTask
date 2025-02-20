import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a proper loading spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <> {children} </>;
}
