
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Ticket, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getUserBookings, cancelBooking } from "@/services/eventService";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Booking {
  id: string;
  userId: string;
  eventId: string;
  ticketQuantity: number;
  totalPrice: number;
  status: "confirmed" | "cancelled";
  bookingDate: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl: string;
}

interface BookingWithEvent {
  booking: Booking;
  event: Event;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const userBookings = await getUserBookings(user.id);
        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load your bookings");
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user, navigate]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      
      // Update the booking status in the local state
      setBookings(prevBookings => 
        prevBookings.map(item => 
          item.booking.id === bookingId 
            ? { ...item, booking: { ...item.booking, status: "cancelled" as const } } 
            : item
        )
      );
      
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
    setCancellingId(null);
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

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your event bookings and tickets
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse-glow bg-primary/20 h-12 w-12 rounded-full"></div>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((item, index) => (
              <Card 
                key={item.booking.id} 
                className={`overflow-hidden glass-card border-white/10 animate-fade-in ${
                  item.booking.status === "cancelled" ? "opacity-60" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-40">
                  <img 
                    src={item.event.imageUrl} 
                    alt={item.event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 w-full p-4">
                    <h3 className="text-xl font-semibold line-clamp-1 text-white">
                      {item.event.title}
                    </h3>
                  </div>
                  <div className="absolute top-2 right-2">
                    {item.booking.status === "cancelled" ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <X className="h-3 w-3" /> Cancelled
                      </Badge>
                    ) : isUpcoming(item.event.date) ? (
                      <Badge variant="default" className="bg-primary flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Confirmed
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(item.event.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="line-clamp-1">{item.event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Ticket className="h-4 w-4 mr-2" />
                    <span>
                      {item.booking.ticketQuantity} {item.booking.ticketQuantity === 1 ? 'ticket' : 'tickets'} - 
                      ${item.booking.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                
                <Separator className="bg-white/5" />
                
                <CardFooter className="p-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/events/${item.event.id}`)}
                  >
                    View Event
                  </Button>
                  
                  {item.booking.status === "confirmed" && isUpcoming(item.event.date) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          disabled={!!cancellingId}
                        >
                          {cancellingId === item.booking.id ? "Cancelling..." : "Cancel"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelBooking(item.booking.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card border-white/10 p-8 rounded-xl text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">No Bookings Found</h2>
          <p className="text-muted-foreground mb-6">
            You haven't booked any events yet. Start exploring events and book your first ticket!
          </p>
          <Button onClick={() => navigate("/events")}>
            Browse Events
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
