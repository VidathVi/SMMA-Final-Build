"use client";

import Image from "next/image";
import { Sora,Inter } from "next/font/google";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const sora = Sora({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});
 

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const bodyData: any = { name, email, password };
            // Pass role only if user typed one
            if (role) bodyData.role = role.toLowerCase();

            const res = await fetch("http://127.0.0.1:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
            });

            const data = await res.json();
            
            if (!res.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    throw new Error(data.errors.map((e: any) => e.message).join(", "));
                }
                throw new Error(data.message || "Registration failed");
            }

            // On success, redirect to login page
            router.push("/signin");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        alert(`${provider} Login is ready! To make it functional, you will need to create a Developer Account for ${provider}, copy the Client ID, and drop it into an OAuth provider like NextAuth.js in our project.`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-r from-[#020617] via-[#0A0A3C] to-[#020024] bg-[length:300%_300%] animate-gradient">
 
            <div className="relative w-full max-w-5xl h-[620px] rounded-3xl bg-[#1E3C6D]/50 overflow-hidden shadow-2xl flex transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                
                {/* Left Side - Illustration and Text */}

                <div className="relative h-full w-1/2 max-w-[500px] bg-gradient-to-r from-cyan-500/30 to-blue-500/50 rounded-r-[150px] flex items-center justify-center px-10 text-center overflow-hidden">

                    {/* Logo */}
                    <div className="absolute top-6 left-6 z-10">
                        <Image
                        src="/logo.png"
                        alt="Illustration"
                        width={100}
                        height={40}
                        className="object-contain"
                        />
                    </div>

                    {/* Centered Left Text */}
                    <div className="w-full px-10">
                        <h1 className={`${inter.className} text-4xl font-bold tracking-wide text-[#F5EFE7]`}>
                        Welcome to <br />
                        <span className="text-white">Orean360</span>
                        </h1>    
                    </div>

                    <div className="absolute bottom-35 flex items-center justify-center w-full">
                        <p className={`${inter.className} text-sm text-[#F5EFE7]/50`}>
                            already have an account?
                        </p>
                    </div>

                    <div className="absolute bottom-20 flex items-center justify-center w-full">
                        <Link href="/signin">
                            <button className="px-6 py-3 bg-cyan-500/20 text-white rounded-full hover:bg-cyan-500/10 transition-all duration-300">
                                Login
                            </button>
                        </Link>
                    </div>

                </div> 
             
                {/* Right Side - Signup Form */}
                <div className="absolute top-20 text-[#F5EFE7] flex justify-center items-start w-1/2 right-0 px-10">
                    <h1 className={`${inter.className} text-3xl font-bold`}>Create an Account</h1>
                 

                    <form onSubmit={handleRegister} className="space-y-6 absolute top-15 w-[350px]">
                        {error && (
                            <div className="bg-red-500/20 text-red-200 border border-red-500/50 rounded-lg p-3 text-sm">
                                {error}
                            </div>
                        )}
                        <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full rounded-full px-5 py-3 bg-[#243F6B] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                        <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="   w-full rounded-full px-5 py-3 bg-[#243F6B] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400  "
                        />
                        <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Workplace Name"
                        title="Used as your Full Name"
                        className="w-full rounded-full px-5 py-3 bg-[#243F6B] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400  "
                        />
                        <input 
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Role (e.g. manager, designer)"
                        className="w-full rounded-full px-5 py-3 bg-[#243F6B] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400  "
                        />
                        <div className="flex items-center justify-center pt-2">
                            <button type="submit" disabled={isLoading} className="w-[200px] py-3 bg-cyan-500/80 text-white rounded-full hover:bg-cyan-500/20 transition-all duration-300">
                                {isLoading ? "Registering..." : "Register"}
                            </button>
                        </div>

                        {/* divider */}
                        <div className="flex items-center gap-4 my-4 text-white/40">
                            <div className="flex-1 h-px bg-white/20" />
                            <span className="text-sm">or</span>
                            <div className="flex-1 h-px bg-white/20" />
                        </div>
                    

                        
                        {/* Social Media Signup Options */}
                        <div className="absolute bottom-[-45px] right-[-70px] w-[350px]">

                            <div className="flex items-center gap-4">

                                <div onClick={() => handleSocialLogin("Google")} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/40 transition-all duration-300 hover:scale-110 cursor-pointer">
                                    <FaGoogle size={20} className="text-white" />
                                </div> 

                                <div onClick={() => handleSocialLogin("Facebook")} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/40 transition-all duration-300 hover:scale-110 cursor-pointer">
                                    <FaFacebook size={18} className="text-white" />
                                </div>

                                <div onClick={() => handleSocialLogin("LinkedIn")} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/40 transition-all duration-300 hover:scale-110 cursor-pointer">
                                    <FaLinkedin size={20} className="text-white" />
                                </div>
                                                

                                <div onClick={() => handleSocialLogin("Instagram")} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/40 transition-all duration-300 hover:scale-110 cursor-pointer">
                                    <FaInstagram size={18} className="text-white" />
                                </div>
                                                

                            </div>

                        </div>

                    </form>

                </div>
 
            </div>
                 
        </div>
         
    )

}