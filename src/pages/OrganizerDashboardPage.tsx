
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, BarChart3, MoreVertical, PlusCircle, Edit, Trash, AlertCircle, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getOrganizerEvents, createEvent } from "@/services/eventService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const OrganizerDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    availableTickets: "",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "",
  });
  
  // Sample image URLs for quick selection
  const sampleImages = [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1540304453527-62f979142a17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    "https://images.unsplash.com/photo-1585211969224-3e992986159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80",
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  ];

  useEffect(() => {
    // Redirect if not logged in or not an organizer
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (user.role !== "organizer") {
      navigate("/dashboard");
      toast.error("You don't have organizer permissions");
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const organizerEvents = await getOrganizerEvents(user.id);
        setEvents(organizerEvents);
      } catch (error) {
        console.error("Error fetching organizer events:", error);
        toast.error("Failed to load your events");
      }
      setLoading(false);
    };

    fetchEvents();
  }, [user, navigate]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newEvent.title || !newEvent.description || !newEvent.date || 
        !newEvent.location || !newEvent.price || !newEvent.availableTickets ||
        !newEvent.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsCreatingEvent(true);
    
    try {
      const createdEvent = await createEvent({
        title: newEvent.title,
        description: newEvent.description,
        date: new Date(newEvent.date).toISOString(),
        location: newEvent.location,
        price: parseFloat(newEvent.price),
        availableTickets: parseInt(newEvent.availableTickets),
        imageUrl: newEvent.imageUrl,
        category: newEvent.category,
        organizerId: user!.id,
        organizerName: user!.name
      });
      
      // Add to local state
      setEvents(prevEvents => [...prevEvents, createdEvent]);
      
      // Reset form and close dialog
      setNewEvent({
        title: "",
        description: "",
        date: "",
        location: "",
        price: "",
        availableTickets: "",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        category: "",
      });
      
      setDialogOpen(false);
      toast.success("Event created successfully");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
    
    setIsCreatingEvent(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
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

  const getCategoryOptions = () => {
    return [
      "concerts",
      "conferences",
      "workshops",
      "sports",
      "arts",
      "entertainment"
    ];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your events
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
            <form onSubmit={handleCreateEvent}>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new event
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="title" className="required">Event Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="description" className="required">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event"
                    rows={4}
                    value={newEvent.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="date" className="required">Date & Time</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="location" className="required">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Event location"
                      value={newEvent.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="price" className="required">Ticket Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={newEvent.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="availableTickets" className="required">Available Tickets</Label>
                    <Input
                      id="availableTickets"
                      name="availableTickets"
                      type="number"
                      min="1"
                      placeholder="100"
                      value={newEvent.availableTickets}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="category" className="required">Category</Label>
                  <Select
                    name="category"
                    value={newEvent.category}
                    onValueChange={(value) => 
                      setNewEvent(prev => ({ ...prev, category: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCategoryOptions().map(category => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="imageUrl">
                    Event Image URL
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleImages.map((url, index) => (
                      <div 
                        key={index} 
                        className={`relative rounded-md overflow-hidden aspect-video cursor-pointer border-2 ${
                          newEvent.imageUrl === url ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setNewEvent(prev => ({ ...prev, imageUrl: url }))}
                      >
                        <img 
                          src={url} 
                          alt={`Sample ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={newEvent.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90" 
                  disabled={isCreatingEvent}
                >
                  {isCreatingEvent ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse-glow bg-primary/20 h-12 w-12 rounded-full"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <Card 
              key={event.id} 
              className="glass-card border-white/10 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video relative">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-sm text-white rounded-full h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <CardHeader className="py-3">
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(event.date)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="py-2">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Price: ${event.price.toFixed(2)}</span>
                  <span>Available: {event.availableTickets} tickets</span>
                </div>
              </CardContent>
              
              <Separator className="bg-white/5" />
              
              <CardFooter className="flex justify-between py-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <Image className="h-4 w-4 mr-2" />
                  View
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Stats
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="glass-card border-white/10 p-8 rounded-xl text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">No Events Created Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't created any events yet. Click on the "Create Event" button to get started.
          </p>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Your First Event
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboardPage;
