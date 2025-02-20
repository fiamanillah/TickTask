import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { ThemeProvider } from './components/theme-provider.jsx';
import MainRoutes from './routes/MainRoutes.jsx';
import AuthProvider from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <MainRoutes />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
);
