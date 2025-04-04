
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Ticket, Users, ChevronLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getEventById, bookEvent } from "@/services/eventService";

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
  organizerId: string;
  organizerName: string;
}

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      setLoading(true);
      try {
        const eventData = await getEventById(eventId);
        if (eventData) {
          setEvent(eventData);
        } else {
          navigate("/events");
          toast.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      }
      setLoading(false);
    };
    
    fetchEvent();
  }, [eventId, navigate]);

  const handleBooking = async () => {
    if (!user) {
      toast.warning("Please log in to book tickets");
      navigate("/auth", { state: { returnUrl: `/events/${eventId}` } });
      return;
    }
    
    if (!event) return;
    
    setIsBooking(true);
    try {
      await bookEvent(user.id, event.id, ticketQuantity);
      toast.success("Tickets booked successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error booking tickets:", error);
      toast.error("Failed to book tickets. Please try again.");
    }
    setIsBooking(false);
  };

  const handleQuantityChange = (value: number) => {
    if (!event) return;
    
    // Ensure quantity is within valid range
    const newQuantity = Math.max(1, Math.min(value, event.availableTickets));
    setTicketQuantity(newQuantity);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const shareEvent = () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out this event: ${event?.title}`,
        url: shareUrl,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(shareUrl);
      toast.success("Event URL copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse-glow bg-primary/20 h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Event not found</h2>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/events" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Events
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          <div className="relative rounded-xl overflow-hidden h-64 md:h-96 glass-card animate-fade-in">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full glass-card bg-white/10" 
                onClick={shareEvent}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-24"></div>
          </div>

          {/* Event Title & Meta */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex flex-wrap gap-y-3 gap-x-6 text-muted-foreground mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center">
                <Ticket className="h-5 w-5 mr-2" />
                <span>${event.price.toFixed(2)} per ticket</span>
              </div>
            </div>

            <div className="mb-6">
              <span className="inline-block text-sm px-3 py-1 bg-accent text-accent-foreground rounded-full capitalize">
                {event.category}
              </span>
            </div>
          </div>
          
          <Separator className="bg-white/5" />

          {/* Event Description */}
          <div className="prose prose-invert max-w-none opacity-80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold mb-4">About This Event</h2>
            <p className="whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>
          
          <Separator className="bg-white/5" />
          
          {/* Organizer */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold mb-4">Organizer</h2>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground mr-4">
                {event.organizerName.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{event.organizerName}</p>
                <p className="text-sm text-muted-foreground">Event Organizer</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Booking */}
        <div className="lg:col-span-1">
          <Card className="glass-card border-white/10 sticky top-24 animate-scale-in">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Book Tickets</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Price per ticket</span>
                  <span className="font-medium">${event.price.toFixed(2)}</span>
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-sm text-muted-foreground mb-2">
                    Number of tickets
                  </label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(ticketQuantity - 1)}
                      disabled={ticketQuantity <= 1}
                    >
                      <span>-</span>
                    </Button>
                    <div className="w-12 text-center">{ticketQuantity}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(ticketQuantity + 1)}
                      disabled={ticketQuantity >= event.availableTickets}
                    >
                      <span>+</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {event.availableTickets} tickets available
                  </span>
                </div>
                
                <Separator className="bg-white/5" />
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">${(event.price * ticketQuantity).toFixed(2)}</span>
                </div>
                
                <Button
                  onClick={handleBooking}
                  disabled={isBooking || event.availableTickets === 0}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isBooking ? "Processing..." : "Book Now"}
                </Button>
                
                {event.availableTickets === 0 && (
                  <p className="text-sm text-destructive text-center">
                    Sorry, this event is sold out!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
