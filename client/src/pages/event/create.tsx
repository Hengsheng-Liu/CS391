import { useEffect, useState } from "react";
import { Form, Input, InputNumber, DatePicker, Button, Typography } from "antd";
const { Title } = Typography; // Destructure Title for easier usage
import moment from "moment"; // Import moment for date handling
import { useAuth } from "@/contexts/UserContext"; // Custom hook for user authentication
import { useRouter } from "next/router"; // Next.js router for navigation

// Backend API base URL (can be moved to an environment variable for better management)
const Backend = "http://localhost:8000";

// Define the Event interface for type safety
interface Event {
  name: string;
  food_type: string;
  description: string;
  location: string;
  rsvp_count: number;
  servings: number;
  expiration: string; // ISO string for expiration
  created_at: string; // ISO string for creation date
  host_id: number; // ID of the event host
  create_by: string; // Name of the creator
}

export default function CreateEvent() {
  const { user } = useAuth(); // Retrieve the authenticated user
  const [form] = Form.useForm(); // Form instance to manage form state
  const [formData, setFormData] = useState<Event | null>(null); // State to store formatted form data
  const router = useRouter(); // Router instance for navigation
  const [error, setError] = useState<string | null>(null); // State to handle error messages
  const { eventId } = router.query; // Get `eventId` from query parameters for edit functionality

  // Effect to fetch existing event data when editing an event
  useEffect(() => {
    if (eventId) {
      fetch(`../api/events/${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          form.setFieldsValue({
            ...data,
            expiration: moment(data.expiration), // Convert expiration to moment object for DatePicker
            created_at: moment(data.created_at), // Convert created_at to moment object for DatePicker
          });
        })
        .catch((err) => {
          setError("Failed to load event data");
          console.error(err);
        });
    }
  }, [eventId]);

  /**
   * Function to handle event creation or update
   * - Sends a POST or PUT request based on whether `eventId` exists
   * - Uses the appropriate endpoint and method
   */
  async function createEvent(event: Event) {
    const endpoint = eventId
      ? `../api/events/${eventId}` // Update event
      : `../api/events`; // Create new event
    const method = eventId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event), // Send event data as JSON
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error creating event");
      }

      router.push("/"); // Navigate to the home page on success
    } catch (error: any) {
      setError(error.message); // Set error message in case of failure
    }
  }

  /**
   * Function to handle form submission
   * - Formats the form values
   * - Sends the data to `createEvent` for processing
   */
  const onFinish = async (values: any) => {
    const formattedData: Event = {
      ...values,
      expiration: values.expiration?.toISOString(), // Format expiration date to ISO string
      created_at: values.created_at?.toISOString(), // Format created_at date to ISO string
      host_id: user?.id || -1, // Set host ID to user ID, default to -1
      create_by: user?.name || "Unknown", // Set creator name, default to "Unknown"
    };

    console.log("Formatted Form Data:", formattedData);
    setFormData(formattedData); // Update formData state
    await createEvent(formattedData); // Call createEvent function
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Food Event Form</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish} // Handle form submission
        initialValues={{
          name: "",
          food_type: "",
          description: "",
          location: "",
          rsvp_count: 0,
          servings: 0,
          expiration: null, // Default expiration as null
          created_at: moment(), // Default to current time
        }}
      >
        {/* Name field */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input placeholder="Enter event name" />
        </Form.Item>

        {/* Food Type field */}
        <Form.Item
          label="Food Type"
          name="food_type"
          rules={[{ required: true, message: "Please enter the food type" }]}
        >
          <Input placeholder="Enter food type" />
        </Form.Item>

        {/* Description field */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        {/* Location field */}
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter the location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* RSVP Count field */}
        <Form.Item
          label="RSVP Count"
          name="rsvp_count"
          rules={[{ required: true, message: "Please enter the RSVP count" }]}
        >
          <InputNumber min={0} placeholder="Enter RSVP count" />
        </Form.Item>

        {/* Servings field */}
        <Form.Item
          label="Servings"
          name="servings"
          rules={[{ required: true, message: "Please enter the number of servings" }]}
        >
          <InputNumber min={0} placeholder="Enter servings count" />
        </Form.Item>

        {/* Expiration Date field */}
        <Form.Item
          label="Expiration Date"
          name="expiration"
          rules={[{ required: true, message: "Please select an expiration date" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        {/* Created At field */}
        <Form.Item
          label="Created At"
          name="created_at"
          rules={[{ required: true, message: "Please select a created date" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        {/* Submit button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      {/* Display error message if any */}
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </div>
  );
}
