"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  MessageSquare,
  Lock,
  Brain,
  Sparkles,
  Clock,
} from "lucide-react";
import { auth } from "../firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Landing = () => {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/dashboard");
    });
    return () => unsub();
  }, [router]);

  const handleGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/dashboard");
    } catch (e) {
      setErr(e?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPassword = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.replace("/dashboard");
    } catch (e) {
      setErr(e?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const platformFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Engine",
      desc: "Powered by GPT OSS 20B for intelligent responses.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Generate text in seconds with optimized performance.",
    },
    {
      icon: MessageSquare,
      title: "Conversation Memory",
      desc: "Save and access your chat history anytime.",
    },
    {
      icon: Lock,
      title: "Private & Secure",
      desc: "Firebase authentication with encrypted storage.",
    },
    {
      icon: Sparkles,
      title: "Versatile Usage",
      desc: "Writing, brainstorming, problem-solving, and more.",
    },
    {
      icon: Clock,
      title: "Modern Tech Stack",
      desc: "Built with Next.js, Node.js, Express, and MongoDB.",
    },
  ];

  return (
    <>
      <motion.section
        id="home"
        className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_50%)]" />

        <header className="absolute top-0 w-full flex items-center justify-between px-8 py-6 bg-transparent z-10">
          <Link href="/" className="text-2xl font-bold tracking-wider">
            MindScript
          </Link>

          <nav className="hidden md:flex space-x-8 text-gray-300 text-sm">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="#platform" className="hover:text-white transition">
              Features
            </Link>
          </nav>

          <button
            onClick={() => setShowAuth(true)}
            className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-gray-100 transition-all hover:scale-105"
          >
            Get Started
          </button>
        </header>

        <div className="max-w-4xl text-center mt-16 z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              AI-Powered Text Generation that Thinks Like You
            </h1>
          </motion.div>

          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Transform your ideas into intelligent content with MindScript.
            Powered by advanced GPT technology for seamless text generation and
            creative writing assistance.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => setShowAuth(true)}
              className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105"
            >
              Start Creating
            </button>
            <Link
              href="#platform"
              className="px-8 py-3 border border-gray-600 rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Built with cutting-edge AI technology
        </motion.div>

        {showAuth && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50">
            <motion.div
              className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {mode === "signin" ? "Welcome Back" : "Create Account"}
                </h3>
                <button
                  onClick={() => setShowAuth(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode("signin")}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition ${
                    mode === "signin"
                      ? "bg-white text-black"
                      : "border border-gray-700 text-gray-400"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition ${
                    mode === "signup"
                      ? "bg-white text-black"
                      : "border border-gray-700 text-gray-400"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? "Please wait..." : "Continue with Google"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-500">
                    or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleEmailPassword} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-gray-500 transition"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-gray-500 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                >
                  {loading
                    ? "Working..."
                    : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </form>

              {err && (
                <p className="text-red-400 text-sm mt-4 text-center">{err}</p>
              )}
            </motion.div>
          </div>
        )}
      </motion.section>

      <section
        id="platform"
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 flex flex-col items-center justify-center px-8 py-24"
      >
        <div className="max-w-6xl text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose MindScript?
            </h2>
            <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
              Experience the power of advanced AI text generation with a
              platform built for speed, security, and seamless creativity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((card, i) => (
              <motion.div
                key={i}
                className="p-8 bg-white shadow-lg rounded-3xl flex flex-col items-center text-center border border-gray-100 hover:shadow-xl transition-all"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                  <card.icon className="h-8 w-8 text-gray-900" />
                </div>
                <h4 className="font-bold text-xl mb-3">{card.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} MindScript. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Landing;