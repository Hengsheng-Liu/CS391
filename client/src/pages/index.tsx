import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Typography,
  Alert,
  Table,
  Pagination,
  Layout,
  Menu,
  theme,
  Divider,
  Card,
  Col,
  Row,
  Popconfirm,
} from "antd";
import { useRouter } from "next/router";
import { link } from "fs";
import Link from "next/link";
import { useAuth } from "@/contexts/UserContext";
const { Title } = Typography;

// Define the Event interface
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
  create_by: number;
}

export default function Home() {

  // State for storing events and loading status
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const {user} = useAuth();

  // Function to handle event deletion
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
  
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data:Event[]= await response.json();
        const stillAvailableEvents = data.filter(
          (event: Event) => new Date(event.expiration) > new Date()
        );
        setEvents(stillAvailableEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

     // Define table columns
    const columns = [
      {
        title: "Event Title",
        dataIndex: "name", 
        key: "name",
        render: (text: string, record: Event) => (
          <Link href={`/event/${record.id}`}>
            {text}
          </Link>
        ),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Location",
        dataIndex: "location",
        key: "location",
      },
      {
        title: "Expiration Time",
        dataIndex: "expiration", 
        key: "expiration",
        render: (text: string) => new Date(text).toLocaleString(), 
      },
      {
        title: "Total Servings",
        dataIndex: "servings",
        key: "servings",
      },
      {
        title: "RSVP Spots Left",
        dataIndex: "rsvp_count",
        key: "rsvp_count",
      },
    ];

  return (
      <div style={{ padding: 20 }}>
        <Typography.Title level={2}>Welcome to SparkBytes</Typography.Title>
        <Typography.Paragraph>
          Find free food events happening on campus!
        </Typography.Paragraph>
        {loading ? (
          <Alert message="Loading events..." type="info" />
        ) : (
          // Render table of events
          <Table         dataSource={events.map((event) => ({
            ...event,
            key: event.id,
          }))}columns={columns} pagination={false} />
        )}
        <Pagination defaultCurrent={1} total={events.length} />
        <Button type="primary" onClick={() => router.push("/event/create")}>Create Event</Button>
      </div>
  );
}
