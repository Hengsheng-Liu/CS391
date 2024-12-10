import { useEffect, useState } from "react";
import { Typography, Card, List, Button, Tabs, Tag, Spin } from "antd";
import { useAuth } from "@/contexts/UserContext";
import { useRouter } from "next/router";

// Define About component
export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Effect hook for authentication and data fetching
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    /* if (user?.id) {
      const fetchEvents = async () => {
        try {
          // Fetch all events
          const eventsResponse = await fetch("/api/events");
          const eventsData = await eventsResponse.json();
          
          // Filter events created by the user
          const userEvents = eventsData.filter((event: Event) => event.host_id === user.id);
          setCreatedEvents(userEvents);

          // For each event, fetch its detailed version that includes participants
          const detailedEvents = await Promise.all(
            eventsData.map(async (event: Event) => {
              const detailResponse = await fetch(`/api/events/${event.id}`);
              return detailResponse.json();
            })
          );

          // Filter events where the user is a participant
          const userRsvpedEvents = detailedEvents.filter((event: Event) => 
            event.participants?.some((participant: User) => participant.id === user.id)
          );
          
          setRsvpedEvents(userRsvpedEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();
    } */
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // If no user, don't render anything (redirect will happen in useEffect)
  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>About</h1>
      <p>
        Spark!Bytes is a platform for seeking out and sharing free food opportunities around campus. Those with a BU email can sign
        up. 
      </p>
      <p>
        On the Home page, one can view and RSVP for the currently active events and click on the Create event button to post about their own
        free food opportunity.
      </p>
      <p>
        Under the Profile page, users can see account related information as well as events that they are 
        signed up for or have created. It is here that they can also modify events they created or withdraw from events that they RSVPed
        for.
      </p>
    </div>
  );
}