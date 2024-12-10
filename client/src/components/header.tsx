import React from "react";
import { Layout, Menu, Button } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/UserContext";
const { Header } = Layout;

const CustomHeader = () => {
  // Access user data and logout function from auth context
  const { user, logout } = useAuth();
  const router = useRouter();

  // Define menu item labels and routes
  const menuItems = [
    { key: '0', label: 'Home', href: '/' },
    { key: '1', label: 'Profile', href: '/profile'},
    { key: '2', label: 'About', href: '/about'},
    { key: '3', label: user?.name || "",  href: '', disabled: true }, // display user name when possible
  ];

  // Handle menu click for navigation
  const handleClick = (e: MenuInfo) => {
    const parsedKey = parseInt(e.key);
    if (parsedKey < 0 || parsedKey >= menuItems.length) return;
    router.push(menuItems[parsedKey].href);
  };

  return (
    <Header 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        padding: "0 24px",
        height: "64px"  // Standard Ant Design header height
      }}
    >
      <div style={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center"  // This centers items vertically
      }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[router.pathname]}
          onClick={handleClick}
          style={{ flex: 1 }}  // This allows the menu to take up available space
          items={menuItems.map(item => ({
            key: item.key,
            label: item.label,
          }))}
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