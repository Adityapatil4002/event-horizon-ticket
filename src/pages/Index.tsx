import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Search, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getAllEvents, getEventCategories } from "@/services/eventService";
import TestimonialsSlider from "@/components/TestimonialsSlider";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  imageUrl: string;
  category: string;
}

const Index = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getAllEvents();
        // Get 3 random events for the featured section
        const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
        setFeaturedEvents(shuffled.slice(0, 3));
        
        const cats = await getEventCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
    fetchEvents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to events page with search query
    window.location.href = `/events?search=${encodeURIComponent(searchTerm)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black h-[70vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')" }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in text-gradient mb-6">
              Discover and Book Amazing Events
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Find concerts, workshops, conferences, and more events happening around you.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for events..."
                  className="pl-10 bg-background/20 backdrop-blur-md border-white/10 focus:border-primary h-12 shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-primary hover:bg-primary/90">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={`/events?category=${category}`}
                className="group"
              >
                <div className="glass-card flex flex-col items-center justify-center p-6 text-center transition-all hover-scale hover:shadow-lg hover:shadow-primary/20 animate-scale-in rounded-xl h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-lg capitalize font-medium mb-2">{category}</span>
                  <span className="text-sm text-foreground/70">Explore Events</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 px-4 bg-black/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Link to="/events">
              <Button variant="outline" className="border-white/10">
                View All Events
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <Link 
                to={`/events/${event.id}`}
                key={event.id}
                className="group animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <Card className={`overflow-hidden border-white/5 bg-transparent shadow-lg transition-all duration-300 h-full glass-card ${
                  index % 3 === 0 ? 'event-card-gradient-1' : 
                  index % 3 === 1 ? 'event-card-gradient-2' : 
                  'event-card-gradient-3'
                }`}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-0 right-0 bg-black/50 backdrop-blur-sm text-white p-2 m-2 rounded">
                      ${event.price.toFixed(2)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
                    <div className="flex items-center text-sm text-foreground/70 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-foreground/70">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <p className="mt-3 text-sm line-clamp-2 text-foreground/80">{event.description}</p>
                    <div className="mt-4">
                      <Button variant="default" size="sm" className="w-full bg-primary/80 hover:bg-primary">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-background/90 animate-fade-in">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">What Our Users Say</h2>
          <TestimonialsSlider />
        </div>
      </section>

      {/* Interactive How It Works Section */}
      <section className="py-16 px-4 bg-black/40 animate-fade-in">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:items-stretch gap-10">
          <div className="flex-1 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">How EventHorizon Works</h2>
            <ol className="list-decimal ml-6 text-lg leading-9 text-foreground/80">
              <li>Browse and discover official, legit events with robust search and filters.</li>
              <li>Book tickets instantly and securely using our trusted system.</li>
              <li>Get instant email confirmations & access your tickets any time.</li>
              <li>For organizers, create & manage your own events and bookings easily.</li>
              <li>Join interactive sessions—workshops, networking, live Q&As, and more!</li>
            </ol>
          </div>
          <div className="flex-1 flex flex-col items-center space-y-8 md:items-start">
            <div className="w-64 h-64 glass-card rounded-full flex items-center justify-center relative animate-pulse-glow">
              <span className="text-5xl font-bold text-primary">🎤</span>
              <span className="absolute bottom-4 right-5 text-primary"><b>Legit</b> & Secure</span>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary text-background text-lg px-8 py-4 animate-fade-in transition-transform hover-scale">
              <a href="/events">Find Your Event</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-event-purple/20 to-event-blue/20 animate-pulse-glow"></div>
        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Host Your Own Event?</h2>
            <p className="text-lg text-foreground/80 mb-8">
              Sign up as an organizer and start creating unforgettable experiences for your audience.
            </p>
            <Link to="/auth?type=register&role=organizer">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                Become an Organizer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
