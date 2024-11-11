import { Inter } from "next/font/google";
import { Typography } from "antd";
import App from "../components/Registration";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  return (
    <>
        <Typography.Title>
            Please input information below:
        </Typography.Title>
        <App />
    </>
  );
}