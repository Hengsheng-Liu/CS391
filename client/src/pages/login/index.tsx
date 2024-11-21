import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '@/contexts/UserContext';
import { useEffect } from 'react';

import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

export default function LoginPage() {
  const { user, setUser } = useAuth();
  const [signUp, setSignUp] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();  

  useEffect(() => {
    if (user && router.pathname !== '/') {
      router.push('/');
    }
  }, [user, router.pathname]);

  async function handleSubmit(values: any) {
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
    } catch (error: any) {
      message.error(error.message);
    }
  }

  const validateEmailDomain = (rule: any, value: string) => {
    if (value && !value.endsWith('@bu.edu')) {
      return Promise.reject('The input is not a valid @bu.edu email!');
    } else {
      return Promise.resolve();
    }};

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Title level={2}>{signUp ? 'Sign Up' : 'Log In'}</Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {signUp && (
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a @bu.edu email!' },
            { validator: validateEmailDomain}
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        {signUp && (
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
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
      <Button onClick={() => setSignUp(!signUp)} style={{ width: '100%' }}>
        {signUp ? 'Already have an account? Log In' : 'New User? Sign Up'}
      </Button>
    </div>
  );
}
