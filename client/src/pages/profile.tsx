import { useEffect, useState } from "react";
import { Typography, Card, List, Button, Tabs, Tag } from "antd";
import { useAuth } from "@/contexts/UserContext";
import { useRouter } from "next/router";

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

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [rsvpedEvents, setRsvpedEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch events created by the user
    const fetchCreatedEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        const userEvents = data.filter((event: Event) => event.host_id === user.id);
        setCreatedEvents(userEvents);
      } catch (error) {
        console.error("Error fetching created events:", error);
      }
    };

    // Fetch events the user has RSVP'd to
    const fetchRsvpedEvents = async () => {
      try {
        const response = await fetch(`/api/rsvp?user_id=${user.id}`);
        const data = await response.json();
        setRsvpedEvents(data);
      } catch (error) {
        console.error("Error fetching RSVPed events:", error);
      }
    };

    fetchCreatedEvents();
    fetchRsvpedEvents();
  }, [user]);

  const EventList = ({ events, type }: { events: Event[], type: string }) => (
    <List
      itemLayout="vertical"
      dataSource={events}
      renderItem={(event) => (
        <List.Item
          key={event.id}
          actions={[
            <Button 
              key="view" 
              onClick={() => router.push(`/event/${event.id}?from=profile&tab=${activeTab}`)}
            >
              View Event
            </Button>
          ]}
        >
          <List.Item.Meta
            title={event.name}
            description={
              <>
                <p>{event.description}</p>
                <Tag color="blue">{event.food_type}</Tag>
                <Tag color="green">{new Date(event.expiration).toLocaleDateString()}</Tag>
              </>
            }
          />
        </List.Item>
      )}
    />
  );

  // Define tabs items
  const items = [
    {
      key: '1',
      label: 'Created Events',
      children: <EventList events={createdEvents} type="created" />
    },
    {
      key: '2',
      label: 'RSVPed Events',
      children: <EventList events={rsvpedEvents} type="rsvped" />
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card style={{ marginBottom: "24px" }}>
        <Typography.Title level={2} style={{ marginBottom: "24px" }}>
          User Profile
        </Typography.Title>
        
        <div style={{ display: "grid", gap: "20px" }}>
          <div>
            <Typography.Text strong style={{ fontSize: "16px", display: "block", color: "#666" }}>
              Name
            </Typography.Text>
            <Typography.Text style={{ fontSize: "18px" }}>
              {user?.name || "Not provided"}
            </Typography.Text>
          </div>

          <div>
            <Typography.Text strong style={{ fontSize: "16px", display: "block", color: "#666" }}>
              Email
            </Typography.Text>
            <Typography.Text style={{ fontSize: "18px" }}>
              {user?.email || "Not provided"}
            </Typography.Text>
          </div>

          <div>
            <Typography.Text strong style={{ fontSize: "16px", display: "block", color: "#666" }}>
              Role
            </Typography.Text>
            <Typography.Text style={{ fontSize: "18px" }}>
              Student
            </Typography.Text>
          </div>

          <div>
            <Typography.Text strong style={{ fontSize: "16px", display: "block", color: "#666" }}>
              Member Since
            </Typography.Text>
            <Typography.Text style={{ fontSize: "18px" }}>
              {new Date().toLocaleDateString()}
            </Typography.Text>
          </div>
        </div>
      </Card>

      <Tabs 
        activeKey={activeTab}
        items={items}
        onChange={(key) => setActiveTab(key)}
      />
    </div>
  );
}