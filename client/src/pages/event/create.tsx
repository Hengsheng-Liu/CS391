import { useState } from "react";
import { Form, Input, InputNumber, DatePicker, Button, Typography } from "antd";
const { Title } = Typography;
import moment from "moment";
import { useAuth } from "@/contexts/UserContext";
import { useRouter } from "next/router";
const Backend = "http://localhost:8000";

interface Event {
  name: string;
  food_type: string;
  description: string;
  location: string;
  rsvp_count: number;
  servings: number;
  expiration: string; // ISO string
  created_at: string; // ISO string
  host_id: number;
  create_by: string;
}

export default function CreateEvent() {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<Event | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Function to create a new event
  async function createEvent(event: Event) {
    try {
      const response = await fetch(`../api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error creating event");
      }
      router.push("/");
    } catch (error:any) {
      setError(error.message);
      }
  }

  // Function to handle form submission
  const onFinish = async (values: any) => {
    const formattedData: Event = {
      ...values,
      expiration: values.expiration?.toISOString(), 
      created_at: values.created_at?.toISOString(), 
      host_id: user?.id || -1, 
      create_by: user?.name || "Unknown", 
    };

    console.log("Formatted Form Data:", formattedData);
    setFormData(formattedData);
    const response = await createEvent(formattedData);
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Food Event Form</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
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
        {/* Form items for each field in the Event interface */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input placeholder="Enter event name" />
        </Form.Item>

        <Form.Item
          label="Food Type"
          name="food_type"
          rules={[{ required: true, message: "Please enter the food type" }]}
        >
          <Input placeholder="Enter food type" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter the location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        <Form.Item
          label="RSVP Count"
          name="rsvp_count"
          rules={[{ required: true, message: "Please enter the RSVP count" }]}
        >
          <InputNumber min={0} placeholder="Enter RSVP count" />
        </Form.Item>

        <Form.Item
          label="Servings"
          name="servings"
          rules={[{ required: true, message: "Please enter the number of servings" }]}
        >
          <InputNumber min={0} placeholder="Enter servings count" />
        </Form.Item>

        <Form.Item
          label="Expiration Date"
          name="expiration"
          rules={[{ required: true, message: "Please select an expiration date" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          label="Created At"
          name="created_at"
          rules={[{ required: true, message: "Please select a created date" }]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      {/* Conditional error message */}
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </div>
  );
}
