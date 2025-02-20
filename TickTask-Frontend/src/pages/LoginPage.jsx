import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';

function LoginForm() {
    const [googleLoading, setGoogleLoading] = useState(false);
    const { toast } = useToast();
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            await loginWithGoogle();
            toast({
                variant: 'success',
                title: 'Success',
                description: 'You have successfully logged in.',
            });
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred during login. Please try again.',
            });
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
            <div className="max-w-md w-full  p-6 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6 ">Welcome</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                    Sign in with Google to continue to the app
                </p>
                <Button
                    className="w-full flex items-center justify-center gap-2 border "
                    disabled={googleLoading}
                    type="button"
                    onClick={handleGoogleLogin}
                >
                    {googleLoading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                        <>
                            <FcGoogle className="h-6 w-6" /> Sign in with Google
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default LoginForm;
