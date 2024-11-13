import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Typography, Spin, Card } from "antd";

const { Title, Paragraph } = Typography;

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
}

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetch(`../api/events/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch event");
          }
          return res.json();
        })
        .then((data) => setEvent(data))
        .catch((err) => console.error("Error fetching event:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

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
        <Paragraph>
          <strong>Food Type:</strong> {event.food_type}
        </Paragraph>
        <Paragraph>{event.description}</Paragraph>
        <Paragraph>
          <strong>Location:</strong> {event.location}
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
    </div>
  );
}
