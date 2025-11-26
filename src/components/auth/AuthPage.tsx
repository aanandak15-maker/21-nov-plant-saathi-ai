import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseBlackBoxService } from '@/lib/supabaseBlackBoxService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Sprout, Mail, Phone, Lock, User, Loader2, ArrowLeft, CheckCircle, Shield, Zap, TrendingUp } from 'lucide-react';
import { supabaseAuthService } from '@/lib/supabaseAuthService';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Email/Password state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    // Phone OTP state
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    // Handle email sign up
    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { user, error } = await supabaseAuthService.signUp(email, password, fullName);

            if (error) {
                toast({
                    title: 'Sign Up Failed',
                    description: error.message,
                    variant: 'destructive'
                });
            } else {
                toast({
                    title: 'Success!',
                    description: 'Account created! Let\'s set up your profile.',
                });
                navigate('/onboarding');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle email sign in
    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { user, error } = await supabaseAuthService.signIn(email, password);

            if (error) {
                // Handle specific error cases
                if (error.message.includes('Email not confirmed')) {
                    toast({
                        title: 'Email Not Verified',
                        description: 'Please check your email and click the verification link.',
                        variant: 'destructive'
                    });
                } else {
                    toast({
                        title: 'Sign In Failed',
                        description: error.message,
                        variant: 'destructive'
                    });
                }
            } else {
                toast({
                    title: 'Welcome back!',
                    description: 'Successfully signed in.',
                });

                // Flush current session BlackBox logs to Supabase as user's personal memory
                try {
                    await supabaseBlackBoxService.flushCurrentSession();
                } catch (syncError) {
                    console.error('BlackBox sync after sign-in failed:', syncError);
                }

                navigate('/dashboard');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle phone OTP request
    const handlePhoneOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabaseAuthService.signInWithPhone(phone);

            if (error) {
                toast({
                    title: 'Failed to Send OTP',
                    description: error.message,
                    variant: 'destructive'
                });
            } else {
                setOtpSent(true);
                toast({
                    title: 'OTP Sent!',
                    description: 'Check your phone for the verification code.',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { user, error } = await supabaseAuthService.verifyOtp(phone, otp);

            if (error) {
                toast({
                    title: 'Verification Failed',
                    description: error.message,
                    variant: 'destructive'
                });
            } else {
                toast({
                    title: 'Success!',
                    description: 'Phone verified successfully.',
                });

                // Flush current session BlackBox logs to Supabase after successful phone auth
                try {
                    await supabaseBlackBoxService.flushCurrentSession();
                } catch (syncError) {
                    console.error('BlackBox sync after phone verification failed:', syncError);
                }

                navigate('/dashboard');
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-blue-50">
            {/* Left Side - Benefits */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 p-12 flex-col justify-between text-white">
                {/* Back to Home */}
                <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 w-fit"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
                            <img src="/logo.jpg" alt="Plant Saathi AI" className="h-12 w-12 rounded-lg object-cover" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Plant Saathi AI</h1>
                            <p className="text-green-100">Practical AI for Smallholder Farming</p>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-6 mb-12">
                        <h2 className="text-2xl font-bold">Why farmers choose us:</h2>

                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">85%+ Accuracy</h3>
                                <p className="text-green-100">Pilot-tested disease detection accuracy</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Forever Free Plan</h3>
                                <p className="text-green-100">5 scans/day, no credit card needed</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Smart Features</h3>
                                <p className="text-green-100">NDVI soil health, weather alerts, market prices</p>
                            </div>
                        </div>
                    </div>

                    {/* Pilot Stats */}
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                        <p className="text-sm text-green-100 mb-4">🎓 University Pilot in Progress</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-3xl font-bold">&gt;85%</p>
                                <p className="text-xs text-green-100">Accuracy</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">₹199</p>
                                <p className="text-xs text-green-100">Pro/Month</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">5</p>
                                <p className="text-xs text-green-100">Free Scans</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm text-green-100">
                    <p>Remote-first · Founded 2025</p>
                    <p className="mt-2">plantsaathiai@gmail.com · +91 70047 41371</p>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                {/* Mobile Back Button */}
                <Button
                    variant="ghost"
                    className="lg:hidden absolute top-4 left-4"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <Card className="w-full max-w-md shadow-xl border-2">
                    <CardHeader className="text-center pb-4">
                        <div className="lg:hidden flex justify-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <img src="/logo.jpg" alt="Plant Saathi AI" className="h-10 w-10 rounded object-cover" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome to Plant Saathi</CardTitle>
                        <CardDescription>
                            Sign in to access your farming dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="signin" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="signin">Sign In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                                <TabsTrigger value="phone">Phone</TabsTrigger>
                            </TabsList>

                            {/* Sign In Tab */}
                            <TabsContent value="signin">
                                <form onSubmit={handleEmailSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signin-email"
                                                type="email"
                                                placeholder="farmer@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signin-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Signing In...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Sign Up Tab */}
                            <TabsContent value="signup">
                                <form onSubmit={handleEmailSignUp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signup-name"
                                                type="text"
                                                placeholder="Ramesh Kumar"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="farmer@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signup-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-10"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">Minimum 6 characters</p>
                                    </div>
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Create Free Account'
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-gray-500">
                                        By signing up, you agree to our Terms of Service
                                    </p>
                                </form>
                            </TabsContent>

                            {/* Phone OTP Tab */}
                            <TabsContent value="phone">
                                {!otpSent ? (
                                    <form onSubmit={handlePhoneOTP} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Include country code (e.g., +91 for India)
                                            </p>
                                        </div>
                                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending OTP...
                                                </>
                                            ) : (
                                                'Send OTP'
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp">Verification Code</Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                placeholder="123456"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                maxLength={6}
                                                required
                                            />
                                            <p className="text-xs text-gray-500">
                                                Enter the 6-digit code sent to {phone}
                                            </p>
                                        </div>
                                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                'Verify OTP'
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full"
                                            onClick={() => setOtpSent(false)}
                                        >
                                            Change Phone Number
                                        </Button>
                                    </form>
                                )}
                            </TabsContent>
                        </Tabs>

                        {/* Mobile Benefits */}
                        <div className="lg:hidden mt-6 pt-6 border-t space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Forever free plan available</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>&gt;85% pilot-tested accuracy</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Pro plan just ₹199/month</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
