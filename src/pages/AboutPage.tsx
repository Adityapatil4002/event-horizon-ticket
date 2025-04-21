
import React from "react";

const AboutPage = () => (
  <div className="container mx-auto px-4 py-16 max-w-3xl">
    <h1 className="text-4xl font-bold mb-6 text-gradient">About EventHorizon</h1>
    <p className="text-lg mb-4 text-foreground/90">
      <strong>EventHorizon</strong> is your platform for exploring, booking, and creating incredible events of all kinds.
      We bring together music lovers, techies, artists, and enthusiasts of every kind to enjoy unforgettable experiences—all in one place.
    </p>
    <p className="mb-4 text-foreground/80">
      Whether you’re looking for concerts, conferences, sports, or local gatherings, we make discovering and booking events simple and secure.
      Our organizers are trusted and vetted, so you know you’re always booking legit experiences.
    </p>
    <p className="text-lg text-foreground/80">
      Have questions? <a href="/contact" className="text-primary underline">Contact us here</a>.
    </p>
  </div>
);

export default AboutPage;
