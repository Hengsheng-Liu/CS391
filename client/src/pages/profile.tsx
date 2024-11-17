import { useEffect, useState } from "react";
import { Typography, Card, List, Button, Tabs, Tag, Spin } from "antd";
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [rsvpedEvents, setRsvpedEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Only fetch events if we have a user
    if (user?.id) {
      const fetchEvents = async () => {
        try {
          const response = await fetch("/api/events");
          const data = await response.json();
          // Filter events for the current user
          const userEvents = data.filter((event: Event) => event.host_id === user.id);
          setCreatedEvents(userEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();
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
              {user.name}
            </Typography.Text>
          </div>

          <div>
            <Typography.Text strong style={{ fontSize: "16px", display: "block", color: "#666" }}>
              Email
            </Typography.Text>
            <Typography.Text style={{ fontSize: "18px" }}>
              {user.email}
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