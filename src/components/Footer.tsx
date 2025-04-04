
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background/50 backdrop-blur-sm border-t border-white/5 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-gradient">EventHorizon</span>
            </Link>
            <p className="mt-2 text-sm text-foreground/70">
              Discover and book amazing events around you with ease.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-foreground/90">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/events" className="text-foreground/70 hover:text-foreground transition-colors">All Events</Link></li>
              <li><Link to="/events?category=concerts" className="text-foreground/70 hover:text-foreground transition-colors">Concerts</Link></li>
              <li><Link to="/events?category=workshops" className="text-foreground/70 hover:text-foreground transition-colors">Workshops</Link></li>
              <li><Link to="/events?category=conferences" className="text-foreground/70 hover:text-foreground transition-colors">Conferences</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-foreground/90">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">My Tickets</Link></li>
              <li><Link to="/auth" className="text-foreground/70 hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link to="/auth?type=register" className="text-foreground/70 hover:text-foreground transition-colors">Create Account</Link></li>
              <li><Link to="/organizer" className="text-foreground/70 hover:text-foreground transition-colors">For Organizers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-foreground/90">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Email Support</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-8 pt-8 text-sm text-center text-foreground/50">
          <p>© {new Date().getFullYear()} EventHorizon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
