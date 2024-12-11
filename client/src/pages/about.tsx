import { useEffect } from "react";
import { Typography, Spin, Card, Row, Col } from "antd";
import { useAuth } from "@/contexts/UserContext";
import { useRouter } from "next/router";

const { Title, Paragraph } = Typography;

export default function About() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card style={{ marginBottom: "24px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
        <Title level={2} style={{ textAlign: 'center' }}>About Spark!Bytes</Title>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Paragraph>
              Spark!Bytes is a platform for seeking out and sharing free food opportunities around campus. Anyone with a BU email can sign up!
            </Paragraph>
          </Col>
          <Col span={24}>
            <Paragraph>
              On the Home page, users can view currently active events or press the Create event button to post about their own free food opportunity. Clicking on any event's title will take you to its particular page, where you can view more information about the event. If they created it, they can make edits to it or cancel it here. If they didn't create it, they can RSVP for it or withdraw their RSVP here.
            </Paragraph>
          </Col>
          <Col span={24}>
            <Paragraph>
              Under the Profile page, users can see account-related information as well as events that they are signed up for or have created and can access the same event information as above by clicking "View Event".
            </Paragraph>
          </Col>
          <Col span={24}>
            <Paragraph>
              Finally, users can sign up for email notifications whenever an event is created by clicking on the mail icon in the upper right-hand corner and just next to that is the logout button for when users are ready to head out into the wide world of free food!
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
}