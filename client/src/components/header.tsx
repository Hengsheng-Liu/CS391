import React from "react";
import { Layout, Menu } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/UserContext";
const { Header } = Layout;
const CustomHeader = () => {
  // You'll need to edit this array
  const {user} = useAuth();
  const menuItems: { key: string; label: string; href?: string , disabled?:boolean}[] = [
    // each menu item must contain:
    // key: unique string (should be integer-like, e.g. '0' or '1')
    // label: string
    // href: string (route path) (should not have a trailing-slash, like '/news/'; '/news' is correct.)
    { key: '0', label: 'Home', href: '/' },
    { key: '1', label: 'Post', href: '/post' },
    { key: '2', label: 'Register', href: '/register' },
    { key: '3', label: 'Profile', href: '/profile' },
    { key: '4', label: user?.name || "",  disabled: true, },
    
  ];
  // Don't touch this code, use it in your Menu component from Antd
  const router = useRouter();
  const selectedKey = menuItems
    .findIndex((item) => item.href === router.pathname)
    .toString();

  const handleClick = (e: MenuInfo) => {
    const parsedKey = parseInt(e.key);
    if (parsedKey < 0 || parsedKey >= menuItems.length) return;
    router.push(menuItems[parsedKey].href);
  };

  // Start editing here

  return <Header style={{ display: "flex", alignItems: "center", width: "100%" }}>
    <div style={{ width: "100%" }}>
    <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={handleClick}
        items={menuItems.map(item => ({
          key: item.key,
          label: item.label,
        }))}
      />
    </div>
  </Header>;
};

export default CustomHeader;