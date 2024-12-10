import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import axios from 'axios'; // Import axios for making HTTP requests

interface SubscribeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState("");

  const handleOk = async () => {
    if (email) {
      try {
        const response = await axios.post('/api/notification/subscribe', { email });
        console.log('Response:', response.data);
        message.success('Subscribed to email notifications!');
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        message.error('Failed to subscribe to email notifications.');
      }
    } else {
      message.error('Please enter a valid email address.');
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
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </Modal>
  );
};

export default SubscribeModal;