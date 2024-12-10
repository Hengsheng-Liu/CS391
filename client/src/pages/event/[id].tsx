// Import necessary modules and components
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Typography, Spin, Card, Button, Flex } from "antd";
import { useAuth } from "@/contexts/UserContext";

// Destructure Typography for easier usage
const { Title, Paragraph } = Typography;

// Define TypeScript interfaces for User and Event
interface User {
  id: number;
  name: string;
  email: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  rsvp_count: number;
  expiration: string;
  created_at: string;
  host_id: number;
  create_by: string;
  participants: User[];
  allergies: string[];
  cuisine: string[];
}

// Main EventDetail component
export default function EventDetail() {
  // Initialize router for navigation
  const router = useRouter();
  const { id } = router.query; // Get the event ID from the query parameters

  // Access the authenticated user from the context
  const { user } = useAuth();

  // Define state variables
  const [event, setEvent] = useState<Event | null>(null); // Store event details
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching data
  const [host, setHost] = useState<Boolean>(false); // Check if the user is the event host
  const [couldJoin, setCouldJoin] = useState<Boolean>(false); // Check if the user can join
  const [couldWithdraw, setCouldWithdraw] = useState<Boolean>(false); // Check if the user can withdraw
  const [error, setError] = useState<string | null>(null); // Store error messages

  /**
   * Join an event
   * - Sends a POST request to RSVP for the event
   * - Sets loading to true to trigger re-fetching
   */
  const joinEvent = async () => {
    try {
      const response = await fetch(`../api/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: id, user_id: user?.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to join event');
      }
      setLoading(true); // Trigger re-fetching
    } catch (error: any) {
      setError(error.message);
    }
  };

  /**
   * Withdraw from an event
   * - Sends a DELETE request to remove RSVP
   * - Sets loading to true to trigger re-fetching
   */
  const withdrawEvent = async () => {
    try {
      const response = await fetch(`../api/rsvp?rsvpId=${id}&userId=${user?.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to withdraw from event');
      }
      setLoading(true); // Trigger re-fetching
    } catch (error: any) {
      setError(error.message);
    }
  };

  /**
   * Cancel the event
   * - Sends a DELETE request to cancel the event
   * - Navigates back to the previous page upon success
   */
  const cancelEvent = async () => {
    try {
      const response = await fetch(`../api/events/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to cancel the event');
      }
      router.back(); // Go back to the previous page
    } catch (error: any) {
      setError(error.message);
    }
  };

  /**
   * Fetch event details when the component is mounted or loading is true
   */
  useEffect(() => {
    if (id) {
      fetch(`../api/events/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch event");
          }
          return res.json();
        })
        .then((data) => {
          setEvent(data); // Store the fetched event data
          setCouldJoin(
            new Date(data.expiration) > new Date() && // Event is not expired
            data.rsvp_count > 0 && // RSVP spots available
            data.participants.every((participant: User) => participant.id !== user?.id) && // User is not a participant
            data.host_id !== user?.id // User is not the host
          );
          setCouldWithdraw(
            new Date(data.expiration) > new Date() && // Event is not expired
            data.participants.some((participant: User) => participant.id === user?.id) && // User is a participant
            data.host_id !== user?.id // User is not the host
          );
        })
        .catch((err) => console.error("Error fetching event:", err))
        .finally(() => setLoading(false)); // Stop loading after the fetch
    }
  }, [loading]);

  /**
   * Determine if the user is the host of the event
   */
  useEffect(() => {
    if (event) {
      setHost(event.host_id === user?.id);
    }
  }, [event]);

  // Show loading spinner while fetching event details
  if (loading) {
    return <Spin tip="Loading event details..." />;
  }

  // Show error message if the event is not found
  if (!event) {
    return <Typography.Text type="danger">Event not found</Typography.Text>;
  }

  // Render the event details
  return (
    <div style={{ padding: 20 }}>
      {/* Event details */}
      <Card style={{ marginBottom: 20 }}>
        <Title>{event.name}</Title>
        <Title level={3}>Host Email: {user?.email}</Title>
        <Paragraph>{event.description}</Paragraph>
        <Paragraph>
          <strong>Location:</strong>{" "}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              event.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {event.location}
          </a>
        </Paragraph>
        <Paragraph>
          <strong>RSVP Count:</strong> {event.rsvp_count}
        </Paragraph>
        <Paragraph>
          <strong>Expiration:</strong> {new Date(event.expiration).toLocaleString()}
        </Paragraph>
        <Paragraph>
          <strong>Created At:</strong> {new Date(event.created_at).toLocaleString()}
        </Paragraph>
        <Paragraph>
          <strong>Host ID:</strong> {event.host_id}
        </Paragraph>
        <Paragraph>
          <strong>Created By:</strong> {event.create_by}
        </Paragraph>
        <Paragraph>
          <strong>Allergies:</strong> {event.allergies.join(", ")}
        </Paragraph>
        <Paragraph>
          <strong>Cuisine:</strong> {event.cuisine.join(", ")}
        </Paragraph>
      </Card>

      {/* Participants */}
      <Card title="Participants">
        {event.participants.map((participant) => (
          <Card key={participant.id}>
            <Paragraph>
              <strong>Name:</strong> {participant.name}
            </Paragraph>
            <Paragraph>
              <strong>Email:</strong> {participant.email}
            </Paragraph>
          </Card>
        ))}
      </Card>

      {/* Action buttons */}
      {couldJoin && (
        <Button type="primary" onClick={() => joinEvent()}>
          Join Event
        </Button>
      )}
      {host && (
        <Flex gap="small">
          <Button type="primary" onClick={() => router.push(`/event/create?eventId=${id}`)}>
            Edit Event
          </Button>
          <Button type="primary" onClick={() => cancelEvent()}>
            Cancel Event
          </Button>
        </Flex>
      )}
      {couldWithdraw && (
        <Button type="primary" onClick={() => withdrawEvent()}>
          Withdraw from Event
        </Button>
      )}
      {/* Display errors, if any */}
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </div>
  );
}
