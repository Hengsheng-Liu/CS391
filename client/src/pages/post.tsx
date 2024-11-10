import { Inter } from "next/font/google";
import { Typography } from "antd";

const inter = Inter({ subsets: ["latin"] });

export default function Post() {
  return (
    <>
      <Typography.Paragraph>
        This is where events will be created by users.
      </Typography.Paragraph>
    </>
  );
}