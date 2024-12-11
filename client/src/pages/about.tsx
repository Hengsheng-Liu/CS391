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
        Spark!Bytes is a platform for seeking out and sharing free food opportunities around campus. Anyone with a BU email can sign
        up!
      </p>
      <p>
        On the Home page, users can view currently active events or press the Create event button to post about their own
        free food opportunity. Clicking on any event's title will take you to its particular page, where you can view more information
        about the event. If they created it, they can make edits to it or cancel it here. If they didn't create it, they can RSVP for it
        or withdraw their RSVP here.
      </p>
      <p>
        Under the Profile page, users can see account related information as well as events that they are 
        signed up for or have created and can access the same event information as above by clicking "View Event".
      </p>
      <p>
        Finally, users can sign up for email notifications whenever an event is created by clicking on the mail icon in the upper
        right hand corner and just next to that is the logout button for when users are ready to head out into the wide world of 
        free food!
      </p>
    </div>
  );
}