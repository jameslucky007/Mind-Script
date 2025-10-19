"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

export default function ClientRoot({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detect screen size on load + resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // mobile → collapsed
      } else {
        setIsCollapsed(false); // desktop → expanded
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen">
      {!isLanding && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}
      <main
        className={`flex-1 bg-gray-800 transition-all duration-300 ${
          !isLanding ? (isCollapsed ? "ml-16" : "ml-64") : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
