import React, { useState, useEffect } from "react";
import { Modal, Input, Checkbox, Button, message } from "antd";
import axios from 'axios'; // Import axios for making HTTP requests
import { useAuth } from "@/contexts/UserContext"; // Adjust the import path as needed

interface SubscribeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isVisible, onClose }) => {
  const { user } = useAuth(); // Get the logged-in user's information from the authentication context
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email); // Set the email state to the logged-in user's email
    }
  }, [user]);

  const handleSubscribe = async () => {
    if (isChecked && email) {
      try {
        const response = await axios.post('/api/notification/subscribe', { email });
        console.log('Response:', response.data);
        message.success('Subscribed to email notifications!');
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        message.error('Failed to subscribe to email notifications.');
      }
    } else {
      message.error('Please enter a valid email address and check the box to subscribe.');
    }
    onClose();
  };

  const handleUnsubscribe = async () => {
    if (email) {
      try {
        const response = await axios.post('/api/notification/unsubscribe', { email });
        console.log('Response:', response.data);
        message.success('Unsubscribed from email notifications!');
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        message.success('Unsubscribed from email notifications!');
      }
    } else {
      message.error('Please enter a valid email address to unsubscribe.');
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Subscribe to Email Notifications"
      visible={isVisible}
      onOk={handleSubscribe}
      onCancel={handleCancel}
    >
      <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}>
        I want to receive email notifications for new events.
      </Checkbox>
      <Input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginTop: 16 }}
      />
      <Button
        type="primary"
        danger
        onClick={handleUnsubscribe}
        style={{ marginTop: 16 }}
      >
        Unsubscribe
      </Button>
    </Modal>
  );
};

export default SubscribeModal;