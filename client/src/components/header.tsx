import React, { useState } from "react";
import { Layout, Menu, Button, message } from "antd";
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
    { key: '1', label: 'Profile', href: '/profile' },
    { key: '2', label: user?.name || "", href: '', disabled: true },
  ];

  // Handle menu item click
  const handleClick = (e: MenuInfo) => {
    const parsedKey = parseInt(e.key);
    if (parsedKey < 0 || parsedKey >= menuItems.length) return;
    router.push(menuItems[parsedKey].href);
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
    <Header>
      <div style={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center"  // This centers items vertically
      }}>
        <Menu
          theme="dark"
          mode="horizontal" // Ensure the menu items are displayed horizontally
          selectedKeys={[router.pathname]}
          onClick={handleClick}
          style={{ flex: 1 }}  // This allows the menu to take up available space
          items={menuItems.map(item => ({
            key: item.key,
            label: item.label,
          }))}
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