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
} from "antd";
const { Title } = Typography;

interface Event {
  key: string;
  title: string;
  description: string;
  location: string;
  time: string;
  availability: number;
}

export default function Home() {

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const columns = [
    {
      title: "Event Title",
      dataIndex: "title",
      key: "title",
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
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
    },
  ];

  const handleRegister = () => {
    // Logic for registration (e.g., show registration form)
    alert("Registration functionality to be implemented.");
  };

  const handleLogin = () => {
    // Logic for login (e.g., show login form)
    alert("Login functionality to be implemented.");
  };

  return (
    <div style={{ padding: "0 48px" }}>
      <Title level={2}>Current Events</Title>
      <Divider />
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Event 1" bordered={true}>
              Event content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Event 2" bordered={false}>
              Event content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Event 3" bordered={false}>
              Event content
            </Card>
          </Col>
        </Row>
      </div>

      {/* <div style={{ padding: 20 }}>
        <Typography.Title level={2}>Welcome to SparkBytes</Typography.Title>
        <Typography.Paragraph>
          Find free food events happening on campus!
        </Typography.Paragraph>
        <Button
          type="primary"
          style={{ marginRight: 10 }}
          onClick={handleRegister}
        >
          Register
        </Button>
        <Button type="default" onClick={handleLogin}>
          Login
        </Button>

        The following code seems to be giving an error based on the datasource prop
        {loading ? (
          <Alert message="Loading events..." type="info" />
        ) : (
          <Table dataSource={events} columns={columns} pagination={false} />
        )}
        <Pagination defaultCurrent={1} total={events.length} />
      </div> */}
    </div>
  );
}
