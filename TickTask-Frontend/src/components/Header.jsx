import { Link } from 'react-router';
import { ModeToggle } from './ui/mode-toggle';
import { Button } from '@/components/ui/button';
import { LoaderCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { logout, user, loading } = useAuth();

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-primary/10 ">
            <Link to={'/'} className="no-underline">
                <div className="h-10 flex items-center gap-1.5">
                    <img src="/TickTask.svg" alt="TickTask" className="h-full" />
                    <h1>TickTask</h1>
                </div>
            </Link>
            <div className="flex gap-2">
                <ModeToggle />
                {(loading || user) && (
                    <Button onClick={logout} variant="outline" size="icon" disabled={loading}>
                        {loading ? <LoaderCircle className="animate-spin" /> : <LogOut />}
                    </Button>
                )}
            </div>
        </header>
    );
}
