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

interface Booking {
  id: string;
  userId: string;
  eventId: string;
  ticketQuantity: number;
  totalPrice: number;
  status: "confirmed" | "cancelled";
  bookingDate: string;
}

// Mock events data
const events: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival",
    description: "Experience three days of amazing performances from top artists across multiple stages in a beautiful outdoor setting. Food vendors, art installations, and camping available on site.",
    date: "2025-07-15T18:00:00",
    location: "Central Park, New York",
    price: 89.99,
    availableTickets: 500,
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "concerts",
    organizerId: "2",
    organizerName: "Event Manager"
  },
  {
    id: "2",
    title: "Tech Conference 2025",
    description: "Join industry leaders and innovators for a two-day conference covering the latest in AI, blockchain, and web development. Networking opportunities, workshops, and panel discussions with experts from major tech companies.",
    date: "2025-09-22T09:00:00",
    location: "Convention Center, San Francisco",
    price: 299.99,
    availableTickets: 200,
    imageUrl: "https://images.unsplash.com/photo-1540304453527-62f979142a17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "conferences",
    organizerId: "2",
    organizerName: "Event Manager"
  },
  {
    id: "3",
    title: "Photography Workshop",
    description: "Learn essential photography skills in this hands-on workshop led by professional photographers. From camera basics to advanced composition techniques, suitable for beginners and intermediate photographers.",
    date: "2025-06-10T10:00:00",
    location: "Photography Studio, Chicago",
    price: 149.99,
    availableTickets: 30,
    imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    category: "workshops",
    organizerId: "2",
    organizerName: "Event Manager"
  },
  {
    id: "4",
    title: "Stand-up Comedy Night",
    description: "Laugh until it hurts with performances from five up-and-coming comedians. Full bar and food menu available throughout the show. Age restriction: 18+.",
    date: "2025-05-20T20:00:00",
    location: "Comedy Club, Los Angeles",
    price: 45.00,
    availableTickets: 100,
    imageUrl: "https://images.unsplash.com/photo-1585211969224-3e992986159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80",
    category: "entertainment",
    organizerId: "2",
    organizerName: "Event Manager"
  },
  {
    id: "5",
    title: "Art Exhibition Opening",
    description: "Be the first to explore this innovative collection from international artists exploring themes of nature and technology. Wine and hors d'oeuvres will be served at this exclusive opening night event.",
    date: "2025-08-05T19:00:00",
    location: "Modern Art Gallery, Boston",
    price: 25.00,
    availableTickets: 150,
    imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "arts",
    organizerId: "2",
    organizerName: "Event Manager"
  },
  {
    id: "6",
    title: "Marathon 2025",
    description: "Challenge yourself with this scenic city marathon. All participants receive a medal, t-shirt, and post-race refreshments. Various categories for different age groups and abilities.",
    date: "2025-10-12T07:00:00",
    location: "Downtown, Seattle",
    price: 75.00,
    availableTickets: 1000,
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "sports",
    organizerId: "2",
    organizerName: "Event Manager"
  },
  {
    id: "7",
    title: "Winter Jazz Soirée",
    description: "A cozy evening with live jazz music and local gourmet treats. Perfect for winding down the year with friends and family in an intimate venue.",
    date: "2025-12-11T19:00:00",
    location: "Jazz Club, Denver",
    price: 69.50,
    availableTickets: 65,
    imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    category: "concerts",
    organizerId: "5",
    organizerName: "Denver Jazz"
  },
  {
    id: "8",
    title: "Family Tech Expo",
    description: "Interactive exhibits for all ages showcasing the latest gadgets, games, and learning tools. Robotics demos, VR zones, and workshops for kids and adults.",
    date: "2025-08-29T10:00:00",
    location: "Expo Center, Austin",
    price: 54.00,
    availableTickets: 400,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "conferences",
    organizerId: "3",
    organizerName: "Tech4Good"
  },
  {
    id: "9",
    title: "Evening Yoga in the Park",
    description: "A revitalizing group yoga session in the open air. All skill levels welcome. Bring your own mat and enjoy nature and mindfulness.",
    date: "2025-06-14T18:30:00",
    location: "Sunset Park, Miami",
    price: 15.00,
    availableTickets: 120,
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "sports",
    organizerId: "6",
    organizerName: "Yoga Miami"
  },
  {
    id: "10",
    title: "Career Growth Bootcamp",
    description: "An immersive one-day workshop filled with hands-on career development sessions, expert talks, and professional headshot opportunities.",
    date: "2025-09-07T09:30:00",
    location: "Business Center, Seattle",
    price: 135.00,
    availableTickets: 80,
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "workshops",
    organizerId: "7",
    organizerName: "LevelUp"
  },
  {
    id: "11",
    title: "Open Air Cinema Night",
    description: "Enjoy classic and indie movies under the stars with popcorn and local food trucks. Don’t forget your blanket and friends!",
    date: "2025-07-02T21:00:00",
    location: "Riverfront Park, Nashville",
    price: 12.00,
    availableTickets: 500,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    category: "entertainment",
    organizerId: "8",
    organizerName: "Nashville Film"
  },
  // Add more legit, diverse events to appear realistic and trustworthy
  {
    id: "12",
    title: "World Science Expo 2025",
    description:
      "A global exhibition featuring cutting-edge innovations, live demos from top scientists, and hands-on science activities for all ages. Endorsed by the Global Science Society.",
    date: "2025-11-14T09:00:00",
    location: "Convention Hall, Washington DC",
    price: 189.00,
    availableTickets: 600,
    imageUrl:
      "https://images.unsplash.com/photo-1542826438-8c1f15c65337?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    category: "conferences",
    organizerId: "12",
    organizerName: "Global Science Society",
  },
  {
    id: "13",
    title: "TEDx University Edition",
    description:
      "A licensed TEDx event, bringing together thought leaders and innovators for inspiring talks, engaging panels, and networking with changemakers. License #TEDX-2025-UNI-4342.",
    date: "2025-09-01T13:30:00",
    location: "Auditorium, Harvard University",
    price: 59.99,
    availableTickets: 350,
    imageUrl:
      "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1380&q=80",
    category: "conferences",
    organizerId: "13",
    organizerName: "TEDx Harvard",
  },
  {
    id: "14",
    title: "National Health & Fitness Expo",
    description:
      "Meet certified trainers and attend workshops on holistic wellness, nutrition, and advanced sports medicine. Certified by National Health Board.",
    date: "2025-08-22T10:00:00",
    location: "Expo Center, Houston",
    price: 40.00,
    availableTickets: 800,
    imageUrl:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    category: "sports",
    organizerId: "14",
    organizerName: "Natl. Health Board",
  },
  {
    id: "15",
    title: "Official City New Year Bash 2025",
    description:
      "Presented by City Council. Countdown party with legit live acts, fireworks, and exclusive guest DJs. Official event, all-access passes available.",
    date: "2025-12-31T20:00:00",
    location: "Downtown, Atlanta",
    price: 100.00,
    availableTickets: 2000,
    imageUrl:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80",
    category: "entertainment",
    organizerId: "15",
    organizerName: "Atlanta City Council",
  }
];

// Mock bookings data
let bookings: Booking[] = [];

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  return events;
};

// Get event by ID
export const getEventById = async (id: string): Promise<Event | undefined> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  return events.find(event => event.id === id);
};

// Get events by filters
export const getFilteredEvents = async (filters: {
  search?: string;
  category?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<Event[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return events.filter(event => {
    let matches = true;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      matches = matches && (
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.category && filters.category !== "all") {
      matches = matches && event.category === filters.category;
    }
    
    if (filters.fromDate) {
      matches = matches && new Date(event.date) >= new Date(filters.fromDate);
    }
    
    if (filters.toDate) {
      matches = matches && new Date(event.date) <= new Date(filters.toDate);
    }
    
    return matches;
  });
};

// Create a new event
export const createEvent = async (eventData: Omit<Event, "id">): Promise<Event> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newEvent: Event = {
    ...eventData,
    id: (events.length + 1).toString(),
  };
  
  events.push(newEvent);
  return newEvent;
};

// Book tickets for an event
export const bookEvent = async (
  userId: string,
  eventId: string,
  ticketQuantity: number
): Promise<Booking> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const event = events.find(e => e.id === eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  
  if (event.availableTickets < ticketQuantity) {
    throw new Error("Not enough tickets available");
  }
  
  // Update available tickets
  event.availableTickets -= ticketQuantity;
  
  // Create booking
  const booking: Booking = {
    id: (bookings.length + 1).toString(),
    userId,
    eventId,
    ticketQuantity,
    totalPrice: event.price * ticketQuantity,
    status: "confirmed",
    bookingDate: new Date().toISOString(),
  };
  
  bookings.push(booking);
  return booking;
};

// Get user's bookings
export const getUserBookings = async (userId: string): Promise<{booking: Booking, event: Event}[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userBookings = bookings.filter(booking => booking.userId === userId);
  return userBookings.map(booking => ({
    booking,
    event: events.find(event => event.id === booking.eventId)!
  }));
};

// Get organizer's events
export const getOrganizerEvents = async (organizerId: string): Promise<Event[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return events.filter(event => event.organizerId === organizerId);
};

// Cancel booking
export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }
  
  if (booking.status === "cancelled") {
    throw new Error("Booking is already cancelled");
  }
  
  // Update booking status
  booking.status = "cancelled";
  
  // Return tickets to available pool
  const event = events.find(e => e.id === booking.eventId);
  if (event) {
    event.availableTickets += booking.ticketQuantity;
  }
  
  return booking;
};

// Get event categories
export const getEventCategories = async (): Promise<string[]> => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const categories = events.map(event => event.category);
  return [...new Set(categories)];
};
