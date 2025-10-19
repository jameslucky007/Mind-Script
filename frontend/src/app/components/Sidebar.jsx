"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Bookmark, Settings, Menu, LogOut, User } from "lucide-react";
import { auth } from "../firebase/firebase"; // firebase is at src/app/firebase/firebase.js
import { signOut } from "firebase/auth";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const router = useRouter();

  const menuItems = [
    { name: "Home", icon: <Home size={20} />, href: "/dashboard" },
    { name: "History", icon: <Bookmark size={20} />, href: "/history" },
    { name: "Profile", icon: <User size={20} />, href: "/details" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // redirect to landing page (or login)
      router.replace("/");
    } catch (err) {
      console.error("Logout failed:", err);
      // optional: show a user-friendly toast or alert
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <aside
      className={`
        ${isCollapsed ? "w-16" : "w-64"}
        bg-gray-900 text-white h-screen fixed top-0 left-0
        shadow-lg transition-all duration-300 flex flex-col z-50
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-xl font-bold">MindScript</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
          className="p-1 rounded hover:bg-gray-800"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-2">
        {menuItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-indigo-600 transition mt-5"
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer: Sign out */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500 transition"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
