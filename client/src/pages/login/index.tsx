import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/UserContext';

import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

export default function LoginPage() {
  const { user, setUser } = useAuth();
  const [signUp, setSignUp] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();  

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (values: any) => {
    try {
      const { email, password, name, confirmPassword } = values;

      if (signUp && password !== confirmPassword) {
        message.error('Passwords do not match');
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, signUp }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error during authentication');
      }
      
      setUser(data);
      router.push('/');
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '24px' }}>
      <Title level={2}>{signUp ? 'Sign Up' : 'Log In'}</Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {signUp && (
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        {signUp && (
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
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
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            {signUp ? 'Sign Up' : 'Log In'}
          </Button>
        </Form.Item>
      </Form>
      <Button 
        type="link" 
        onClick={() => {
          setSignUp(!signUp);
          form.resetFields();
        }}
        style={{ padding: 0 }}
      >
        {signUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </Button>
    </div>
  );
}
