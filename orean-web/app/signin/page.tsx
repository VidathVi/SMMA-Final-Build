"use client";

import Image from "next/image";
import { Sora,Inter } from "next/font/google";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
});

export default function SigninPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-r from-[#020617] via-[#0A0A3C] to-[#020024] bg-[length:300%_300%] animate-gradient">

        <div className="relative w-full max-w-5xl h-[620px] rounded-3xl bg-[#1E3C6D]/50 overflow-hidden shadow-2xl flex transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">  

        {/* right Side - Illustration and Text */}
        <div className="absolute h-full w-1/2 max-w-[500px] right-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/50 rounded-l-[150px] flex items-center justify-center px-10 text-center overflow-hidden">
            {/* Logo */}
            <div className="absolute top-6 right-0 z-10">
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
                Welcome <span className="text-beige">Back</span>   
                </h1>    
            </div>
            <div className="absolute bottom-35 flex items-center justify-center w-full">
                <p className={`${inter.className} text-sm text-[#F5EFE7]/50`}>
                    Didn&apos;t have an account?
                </p>
            </div>
            <div className="absolute bottom-20 flex items-center justify-center w-full">
                <button className="px-6 py-3 bg-cyan-500/20 text-white rounded-full hover:bg-cyan-500/10 transition-all duration-300">
                    Register
                </button>
            </div>
        </div>

        {/* Left Side - Form */}
        <div className="absolute top-35 text-[#F5EFE7] flex justify-center items-start w-1/2 left-0 px-10">
            <h1 className={`${inter.className} text-3xl font-bold`}>Sign In With Email</h1>
            <form className="space-y-6 absolute top-15 w-[350px]">
                <input 
                type="email"
                placeholder="Email Address"
                className="w-full rounded-full px-5 py-3 bg-[#243F6B] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input 
                type="Password"
                placeholder="Password"
                className="   w-full rounded-full px-5 py-3 bg-[#243F6B] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-cyan-400  "
                />
                
                <div className="flex items-center justify-center">
                    <button className="w-[200px] py-3 bg-cyan-500/80 text-white rounded-full hover:bg-cyan-500/20 transition-all duration-300">
                        Log In
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

                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/40 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <FaGoogle size={20} className="text-white" />
                        </div> 

                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/40 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <FaFacebook size={18} className="text-white" />
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/40 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <FaLinkedin size={20} className="text-white" />
                        </div>
                                        

                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-500/40 transition-all duration-300 hover:scale-110 cursor-pointer">
                            <FaInstagram size={18} className="text-white" />
                        </div>
                                        

                    </div>

                </div>

            </form>

        </div>

        </div>           
    </div>
    );
}

                    
