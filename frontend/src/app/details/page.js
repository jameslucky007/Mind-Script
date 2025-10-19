"use client";
import React from "react";
import { useAuth } from "../../firebase/useAuth";
import { User, Mail, LogIn, Sparkles } from "lucide-react";

const Page = () => {
  const user = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-800  flex items-center justify-center p-4">
        <div className="relative">
          {/* Animated background elements */}
          <div className="absolute -inset-4 bg-gradient-to-rbg-gray-800  rounded-xl blur opacity-30 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gray-800 rounded-lg blur-sm opacity-20 animate-bounce"></div>
          
          <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-white/20 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4 shadow-lg">
                <LogIn className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 bg-gray-800  bg-clip-text ">
              Welcome Back
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-md">
              Please sign in to access your personalized dashboard and explore amazing features.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">Ready to get started?</span>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800  p-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* Header with animated background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gray-800  rounded-3xl blur opacity-20"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center space-x-6">
              {/* Profile Image with animated border */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gray-800  rounded-full animate-spin-slow opacity-75"></div>
                <div className="relative">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-xl transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-4 border-white/20 shadow-xl">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text ">
                  Welcome back, {user.displayName || 'User'}!
                </h1>
                <div className="flex items-center space-x-2 text-white">
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">{user.email}</span>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="hidden md:flex space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
        
       
    
      </div>
    </div>
  );
};

export default Page;  