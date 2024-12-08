import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Form, Input, InputNumber, DatePicker, Button, Typography } from "antd";
import moment from "moment";
import { useAuth } from "@/contexts/UserContext";

const { Title } = Typography;

export default function CreateEvent() {
  const router = useRouter();
  const { eventId } = router.query; // Get eventId from query parameters
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      // Fetch the existing event data to prepopulate the form
      fetch(`../api/events/${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          form.setFieldsValue({
            ...data,
            expiration: moment(data.expiration), // Format expiration date for DatePicker
            created_at: moment(data.created_at), // Format created_at date for DatePicker
          });
        })
        .catch((err) => {
          setError("Failed to load event data");
          console.error(err);
        });
    }
  }, [eventId]);

  const handleSubmit = async (values: any) => {
    const formattedData = {
      ...values,
      expiration: values.expiration?.toISOString(),
      created_at: values.created_at?.toISOString(),
      host_id: user?.id || -1,
      create_by: user?.name || "Unknown",
    };

    const endpoint = eventId
      ? `../api/events/${eventId}` // Update existing event
      : `../api/events`; // Create new event

    const method = eventId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error processing event");
      }

      router.push("/"); // Redirect to the homepage after success
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>{eventId ? "Update Event" : "Create Event"}</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: "",
          food_type: "",
          description: "",
          location: "",
          rsvp_count: 0,
          servings: 0,
          expiration: null,
          created_at: moment(),
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the event name" }]}
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
            {eventId ? "Update Event" : "Create Event"}
          </Button>
        </Form.Item>
      </Form>
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </div>
  );
}
