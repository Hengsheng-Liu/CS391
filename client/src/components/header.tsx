import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { MailTwoTone } from '@ant-design/icons';
import { MenuInfo } from "rc-menu/lib/interface";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/UserContext";
import SubscribeModal from "./SubscribeModal"; // Import the SubscribeModal component

const { Header } = Layout;

const CustomHeader = () => {
  const { user, logout } = useAuth(); // Get user and logout function from the authentication context
  const router = useRouter(); // Get the router object for navigation

  // State to manage the visibility of the modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Menu items for navigation
  const menuItems = [
    { key: '0', label: 'Home', href: '/' },
    { key: '1', label: 'About', href: '/about' },
    { key: '2', label: 'Profile', href: '/profile' },
    { key: '3', label: user?.name || "", href: '', disabled: true },
  ];

  // Handle menu item click
  const handleClick = (e: MenuInfo) => {
    const selectedKey = e.key; // Use the key directly
    const selectedItem = menuItems.find(item => item.key === selectedKey); // Find the corresponding item
    if (selectedItem) {
      router.push(selectedItem.href); // Navigate to the href of the selected item
    }
  };

  // Handle MailTwoTone icon click to show the modal
  const handleMailClick = () => {
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Header style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', position: 'relative' }}>
      <div style={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center" 
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
          SparkBytes
        </div>

        <Menu
          theme="light"
          mode="horizontal" // Ensure the menu items are displayed horizontally
          selectedKeys={[router.pathname]} // Highlight the active menu item based on the current path
          onClick={handleClick}
          style={{ flex: 1, lineHeight: '64px' }}  // This allows the menu to take up available space
          items={menuItems.map(item => ({
            key: item.key, // Use the key from the menuItems
            label: item.label,
          }))}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        />

        <MailTwoTone
          type="primary"
          twoToneColor="#eb2f96"
          onClick={handleMailClick}
          style={{
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
        <SubscribeModal
          isVisible={isModalVisible}
          onClose={handleModalClose}
        />

        {/* Render logout button if user is authenticated */}   
        {user && (
          <Button 
            type="primary" 
            danger 
            onClick={logout}
            style={{ 
              marginLeft: '16px',
              height: '32px',  // Standard Ant Design button height
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Logout
          </Button>
        )}
      </div>
    </Header>
  );
};

export default CustomHeader;