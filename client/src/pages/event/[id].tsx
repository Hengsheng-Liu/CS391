import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Typography, Spin, Card, Button, Flex } from "antd";
import { useAuth } from "@/contexts/UserContext";

const { Title, Paragraph } = Typography;
interface User {
  id: number;
  name: string;
  email: string;
}
interface Event {
  id: number;
  name: string;
  food_type: string;
  description: string;
  location: string;
  rsvp_count: number;
  servings: number;
  expiration: string;
  created_at: string;
  host_id: number;
  create_by: string;
  participants: User[]
}

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [host, setHost] = useState<Boolean>(false);
  const [couldJoin, setCouldJoin] = useState<Boolean>(false);
  const [couldWithdraw, setCouldWithdraw] = useState<Boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const joinEvent = async () => {
    try {
      const response = await fetch(`../api/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: id, user_id: user?.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to join event');
      }
      setLoading(true);
    } catch (error:any) {
      setError(error.message);
    }
  };
  const withdrawEvent = async () => {
    try {
      const response = await fetch(`../api/rsvp?rsvpId=${id}&userId=${user?.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to withdraw from event');
      }
      setLoading(true);
    } catch (error:any) {
      setError(error.message);
    }
  }
  const cancelEvent = async () => {
    try {
      const response = await fetch(`../api/events/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to cancel the event');
      }
      router.back();
    } catch (error:any) {
      setError(error.message);
    }
  }
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
          setEvent(data); 
          setCouldJoin(
            new Date(data.expiration) > new Date() &&
            data.rsvp_count > 0 &&
            data.participants.every((participant:User) => participant.id != user?.id)
            && data.host_id != user?.id
          );
          setCouldWithdraw(
            new Date(data.expiration) > new Date() &&
            data.participants.some((participant:User) => participant.id == user?.id)
            && data.host_id != user?.id
          );
        })
        .catch((err) => console.error("Error fetching event:", err))
        .finally(() => setLoading(false));
    }
  }, [loading]);
  useEffect(() => {
    if (event) {
      setHost(event.host_id == user?.id);
    }
  }, [event]);
  

  if (loading) {
    return <Spin tip="Loading event details..." />;
  }

  if (!event) {
    return <Typography.Text type="danger">Event not found</Typography.Text>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Card style={{ marginBottom: 20 }}>
        <Title>{event.name}</Title>
        <Title level={3}>Host Email: {user?.email}</Title>
        <Paragraph>
          <strong>Food Type:</strong> {event.food_type}
        </Paragraph>
        <Paragraph>{event.description}</Paragraph>
        <Paragraph>
          <strong>Location:</strong>   <a
    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`}
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
          <strong>Servings:</strong> {event.servings}
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
      </Card>
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
      {couldJoin && <Button type="primary" onClick={() => joinEvent()}>
        Join Event
      </Button>}
      {host && 
      <Flex gap="small">
      <Button type="primary" onClick={() => router.push(`/event/create?eventId=${id}`)}>
        Edit Event
      </Button>
        <Button type ="primary" onClick={() => cancelEvent()}>
        Cancel Event
      </Button>
      </Flex>}
      {couldWithdraw &&
        <Button type="primary" onClick={() => withdrawEvent()}>
        Withdraw from Event
      </Button>}
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </div>
  );
}
