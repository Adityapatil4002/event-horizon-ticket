
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, Search, MapPin, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getFilteredEvents, getEventCategories } from "@/services/eventService";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    fromDate: searchParams.get("fromDate") || "",
    toDate: searchParams.get("toDate") || "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const initialSearch = searchParams.get("search") || "";
        const initialCategory = searchParams.get("category") || "all";
        const initialFromDate = searchParams.get("fromDate") || "";
        const initialToDate = searchParams.get("toDate") || "";
        
        setFilters({
          search: initialSearch,
          category: initialCategory,
          fromDate: initialFromDate,
          toDate: initialToDate
        });
        
        const filteredEvents = await getFilteredEvents({
          search: initialSearch,
          category: initialCategory !== "all" ? initialCategory : undefined,
          fromDate: initialFromDate,
          toDate: initialToDate
        });
        
        setEvents(filteredEvents);
        
        const cats = await getEventCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setLoading(false);
    };
    
    fetchEvents();
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set("search", filters.search);
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);
    
    setSearchParams(params);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      fromDate: "",
      toDate: ""
    });
    setSearchParams(new URLSearchParams());
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Events</h1>
          <p className="text-muted-foreground mt-2">
            Discover events that match your interests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 glass-card rounded-xl p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Filter className="mr-2 h-5 w-5" /> Filters
            </h2>
            {(filters.search || filters.category !== "all" || filters.fromDate || filters.toDate) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs flex items-center"
              >
                <X className="mr-1 h-3 w-3" /> Clear
              </Button>
            )}
          </div>
          
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search events..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left font-normal"
                  >
                    {filters.fromDate ? (
                      format(new Date(filters.fromDate), "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.fromDate ? new Date(filters.fromDate) : undefined}
                    onSelect={(date) => handleFilterChange("fromDate", date ? date.toISOString() : "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left font-normal"
                  >
                    {filters.toDate ? (
                      format(new Date(filters.toDate), "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.toDate ? new Date(filters.toDate) : undefined}
                    onSelect={(date) => handleFilterChange("toDate", date ? date.toISOString() : "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
          </form>
        </div>
        
        {/* Events Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse-glow bg-primary/20 h-12 w-12 rounded-full"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <Link 
                  to={`/events/${event.id}`}
                  key={event.id}
                  className="group animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
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
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-16"></div>
                      <div className="absolute top-0 right-0 bg-black/50 backdrop-blur-sm text-white p-2 m-2 rounded">
                        ${event.price.toFixed(2)}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-foreground/70 mb-2">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-foreground/70">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="mt-3">
                        <span className="inline-block text-xs px-2 py-1 bg-accent text-accent-foreground rounded capitalize">
                          {event.category}
                        </span>
                      </div>
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
          ) : (
            <div className="flex flex-col items-center justify-center h-64 glass-card rounded-xl p-8">
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
