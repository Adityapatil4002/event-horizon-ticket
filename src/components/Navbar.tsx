
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close the menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient">EventHorizon</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-foreground/80 hover:text-foreground transition-colors">
              Events
            </Link>
            {user ? (
              <>
                <Link 
                  to={user.role === "organizer" ? "/organizer" : "/dashboard"} 
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-foreground/80 hover:text-foreground"
                >
                  Logout
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg p-4 animate-fade-in border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground/80 hover:text-foreground py-2 transition-colors">
                Home
              </Link>
              <Link to="/events" className="text-foreground/80 hover:text-foreground py-2 transition-colors">
                Events
              </Link>
              {user ? (
                <>
                  <Link 
                    to={user.role === "organizer" ? "/organizer" : "/dashboard"} 
                    className="text-foreground/80 hover:text-foreground py-2 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="justify-start px-0"
                  >
                    Logout
                  </Button>
                  <div className="py-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </div>
                </>
              ) : (
                <Link to="/auth" className="w-full">
                  <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                    Login / Register
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
