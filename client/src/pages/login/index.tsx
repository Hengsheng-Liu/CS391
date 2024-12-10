// Import necessary hooks, components, and libraries
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/UserContext';

import { Form, Input, Button, Typography, message } from 'antd';

// Destructure Typography for cleaner usage
const { Title } = Typography;

// Define the LoginPage component
export default function LoginPage() {
  // Access user authentication context
  const { user, setUser } = useAuth();

  // State to toggle between login and sign-up forms
  const [signUp, setSignUp] = useState(false);

  // Access the Next.js router for navigation
  const router = useRouter();

  // Create a form instance for managing form state
  const [form] = Form.useForm();  

  /**
   * Effect to redirect logged-in users to the home page
   * - Runs whenever `user` or `router` changes
   */

  useEffect(() => {
    if (user) {
      router.push('/'); // Navigate to the home page if the user is authenticated
    }
  }, [user, router]);

  /**
   * Handle form submission for login or sign-up
   * - Sends form data to the backend API
   * - Handles success and error states
   */

  const handleSubmit = async (values: any) => {
    try {
      const { email, password, name, confirmPassword } = values;


      // Validate passwords match during sign-up

      if (signUp && password !== confirmPassword) {
        message.error('Passwords do not match');
        return;
      }


      // Send data to the API for authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, signUp }),
      });
      const data = await response.json();

      // Handle non-successful responses
      if (!response.ok) {
        throw new Error(data.detail || 'Error during authentication');
      }


      // Set the authenticated user and navigate to the home page
      setUser(data);
      router.push('/');
    } catch (error: any) {
      // Display error message to the user
      message.error(error.message);
    }
  };


  /**
   * Custom validator to ensure email belongs to a specific domain
   * - Only allows emails ending with '@bu.edu'
   */

  const validateEmailDomain = (rule: any, value: string) => {
    if (value && !value.endsWith('@bu.edu')) {
      return Promise.reject('The input is not a valid @bu.edu email!');
    } else {
      return Promise.resolve();
    }
  };

  // Render the login or sign-up form
  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '24px' }}>
      {/* Title for the page */}
      <Title level={2}>{signUp ? 'Sign Up' : 'Log In'}</Title>

      {/* Form for login or sign-up */}
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* Name input field (only visible during sign-up) */}
        {signUp && (
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
        )}
        {/* Email input field with validation */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a @bu.edu email!' },
            { validator: validateEmailDomain },
          ]}
        >
          <Input />
        </Form.Item>
        {/* Password input field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        {/* Confirm password field (only visible during sign-up) */}
        {signUp && (
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  // Ensure the confirmation password matches
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
        {/* Submit button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            {signUp ? 'Sign Up' : 'Log In'}
          </Button>
        </Form.Item>
      </Form>

      {/* Link to toggle between login and sign-up */}
      <Button 
        type="link" 
        onClick={() => {
          setSignUp(!signUp); // Toggle form mode
          form.resetFields(); // Reset form fields
        }}
        style={{ padding: 0 }}
      >
        {signUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </Button>
    </div>
  );
}
