"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Coins } from "lucide-react";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  amount: number;
  durationToBuyPasses: number;
  numberOfPasses: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5001/all-events");
        if (!response.ok) throw new Error("Failed to fetch events.");

        const data = await response.json();

        // Only show events with available passes
        const availableEvents = data.filter((event: Event) => event.numberOfPasses > 0);
        setEvents(availableEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;
  if (events.length === 0) return <p>No available events at the moment.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleBuyPass = async () => {
    setLoading(true);
    setMessage(null);

    try {
        const username = localStorage.getItem("username");
      const response = await fetch(`http://localhost:5001/api/events/${event._id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username}), // Replace with actual username
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to purchase pass.");
      }

      setMessage("Pass purchased successfully!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <Badge variant="secondary" className="w-fit">
          {event.numberOfPasses} passes left
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="text-sm">{new Date(event.date).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.durationToBuyPasses} hours to buy passes</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.numberOfPasses} passes available</span>
          </div>
          <div className="flex items-center">
            <Coins className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.amount.toFixed(2)} Coins</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button className="w-full" onClick={handleBuyPass} disabled={loading}>
          {loading ? "Processing..." : "Buy Pass"}
        </Button>
        {message && <p className="text-sm mt-2 text-red-500">{message}</p>}
      </CardFooter>
    </Card>
  );
}
