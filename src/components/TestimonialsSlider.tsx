
import React, { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Lisa Turner",
    role: "Event Attendee",
    text: "Booking events on EventHorizon is seamless and secure. I discovered amazing concerts and workshops I’d never have found elsewhere.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "James Wu",
    role: "Conference Organizer",
    text: "As an organizer, this platform is a game-changer! Creating events and managing bookings is so intuitive.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    name: "Sarah Kim",
    role: "Artist",
    text: "I loved how my art exhibition was promoted to genuine art lovers. The booking stats really help!",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Michael Brown",
    role: "Sports Enthusiast",
    text: "Tickets are always legit. It's easy to find official marathons and book with confidence.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
];

const TestimonialsSlider = () => {
  const [index, setIndex] = useState(0);

  const nextTestimonial = () => setIndex((idx) => (idx + 1) % testimonials.length);
  const prevTestimonial = () => setIndex((idx) => (idx - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[index];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 transition-all duration-700 animate-scale-in">
      <Card className="glass-card rounded-xl px-8 py-10 text-center relative shadow-xl bg-card/90">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-4 border-primary/30"
        />
        <p className="text-lg font-medium mb-2 text-white/90">"{t.text}"</p>
        <div className="flex justify-center mb-1">
          {[...Array(5)].map((_, i) =>
            <Star
              key={i}
              className={
                "h-4 w-4 inline-block mx-0.5 " +
                (i < t.rating ? "text-primary" : "text-muted-foreground")
              }
              fill={i < t.rating ? "#9b87f5" : "none"}
            />
          )}
        </div>
        <div className="mt-2 text-sm text-muted-foreground font-semibold uppercase tracking-wide">{t.name} – {t.role}</div>
        <button onClick={prevTestimonial} className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/10 text-primary hover:bg-primary/60 transition-all">&lt;</button>
        <button onClick={nextTestimonial} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/10 text-primary hover:bg-primary/60 transition-all">&gt;</button>
      </Card>
    </div>
  );
};

export default TestimonialsSlider;
