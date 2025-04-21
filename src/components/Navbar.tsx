import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <nav className="w-full glass-card px-6 py-3 flex justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <a href="/" className="text-2xl font-bold text-gradient-primary">EventHorizon</a>
        <div className="hidden md:flex gap-3 ml-6">
          <a href="/events" className="hover:text-primary transition-colors">Events</a>
          <a href="/about" className="hover:text-primary transition-colors">About</a>
          <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </>
        ) : (
          <>
            <Link to="/auth?type=login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth?type=register">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
