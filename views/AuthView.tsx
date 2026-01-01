import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface AuthViewProps {
    mode: 'sign-in' | 'sign-up';
}

export const AuthView = ({ mode }: AuthViewProps) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            if (email) {
                login(email);
                navigate('/app');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8 pb-6 text-center">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <span className="text-white font-serif font-bold text-xl">H</span>
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 mb-2">
                        {mode === 'sign-in' ? 'Sign in to HandyWriterz' : 'Create your account'}
                    </h1>
                    <p className="text-sm text-zinc-500">
                        {mode === 'sign-in' ? 'Welcome back! Please enter your details.' : 'Start your academic excellence journey.'}
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6">
                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2 px-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-medium text-zinc-700">
                            <Chrome size={16} /> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 px-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-medium text-zinc-700">
                            <Github size={16} /> GitHub
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-zinc-400">Or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 mb-1.5">Email address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none text-sm transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none text-sm transition-all pr-10"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg shadow-lg shadow-zinc-900/20"
                            isLoading={isLoading}
                        >
                            {mode === 'sign-in' ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="text-center text-xs text-zinc-500">
                        {mode === 'sign-in' ? (
                            <p>Don't have an account? <a href="#/sign-up" className="text-zinc-900 font-medium hover:underline">Sign up</a></p>
                        ) : (
                            <p>Already have an account? <a href="#/sign-in" className="text-zinc-900 font-medium hover:underline">Sign in</a></p>
                        )}
                    </div>
                </div>
                
                <div className="bg-zinc-50 p-4 border-t border-zinc-100 text-center">
                    <p className="text-[10px] text-zinc-400">Secured by Clerk (Demo)</p>
                </div>
            </div>
            
            <div className="mt-8 text-xs text-zinc-400 flex gap-4">
                <a href="#" className="hover:text-zinc-600">Terms</a>
                <a href="#" className="hover:text-zinc-600">Privacy</a>
                <a href="#" className="hover:text-zinc-600">Contact</a>
            </div>
        </div>
    );
};