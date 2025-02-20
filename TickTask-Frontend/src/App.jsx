import Header from './components/Header';
import { Outlet } from 'react-router';
function App() {
    return (
        <div className="max-w-[1920px] mx-auto">
            <Header />
            <Outlet />
        </div>
    );
}

export default App;
