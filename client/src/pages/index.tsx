// Import necessary hooks, components, and libraries
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
import { link } from "fs"; // Unused import, consider removing it
import Link from "next/link";
import { useAuth } from "@/contexts/UserContext";

// Destructure Typography for cleaner usage
const { Title } = Typography;


// Define the structure of an Event object using a TypeScript interface
interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  rsvp_count: number;
  expiration: string;
  created_at: string;
  host_id: number;
  create_by: number;
  allergies: string[];
  cuisine: string[];
}

// Define the main Home component
export default function Home() {

  // State to store events and loading status
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Access the Next.js router for navigation
  const router = useRouter();

  // Access user information from the authentication context
  const { user } = useAuth();

  /**
   * Function to delete an event by ID
   * - Sends a DELETE request to the API
   * - Removes the event from the state upon successful deletion
   */
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Update the state by removing the deleted event
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  /**
   * Effect to fetch events when the component is mounted
   * - Fetches events from the API
   * - Filters out events that have expired
   * - Updates the state with valid events
   */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data: Event[] = await response.json();

        // Filter events to include only those that haven't expired
        const stillAvailableEvents = data.filter(
          (event: Event) => new Date(event.expiration) > new Date()
        );
        setEvents(stillAvailableEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        // Set loading to false once the fetching is complete
        setLoading(false);
      }
    };
    fetchEvents();
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Columns configuration for the Ant Design Table component
   * - Defines how each field of an event is displayed in the table
   */
  const columns = [
    {
      title: "Event Title", // Column header
      dataIndex: "name", // Field in the data source
      key: "name",
      render: (text: string, record: Event) => (
        <Link href={`/event/${record.id}`}>{text}</Link> // Link to the event's details page
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
      render: (text: string) => new Date(text).toLocaleString(), // Format expiration date and time
    },
{
  title: "Allergies",
  dataIndex: "allergies",
  key: "allergies",
  render: (allergies: string[]) => allergies.join(", "), // Assuming allergies is an array of strings
},
{
  title: "Cuisine",
  dataIndex: "cuisine",
  key: "cuisine",
  render: (cuisine: string[]) => cuisine.join(", "), // Assuming cuisine is an array of strings
},
    {
      title: "RSVP Spots Left",
      dataIndex: "rsvp_count",
      key: "rsvp_count",
    },
  ];

  // Render the component's UI
  return (
    <div style={{ padding: 20 }}>
      {/* Page title */}
      <Typography.Title level={2}>Welcome to SparkBytes</Typography.Title>

      {/* Description paragraph */}
      <Typography.Paragraph>
        Find free food events happening on campus!
      </Typography.Paragraph>

      {/* Show loading state or display events table */}
      {loading ? (
        // Show loading alert while events are being fetched
        <Alert message="Loading events..." type="info" />
      ) : (
        // Display the table of events
        <Table
          dataSource={events.map((event) => ({
            ...event,
            key: event.id, // Add a key property for React rendering
          }))}
          columns={columns}
          pagination={false} // Disable pagination for the table
        />
      )}

      {/* Pagination component for navigating between event pages */}
      <Pagination defaultCurrent={1} total={events.length} />

      {/* Button to navigate to the event creation page */}
      <Button type="primary" onClick={() => router.push("/event/create")}>
        Create Event
      </Button>
    </div>
  );
}
