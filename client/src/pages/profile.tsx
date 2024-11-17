import { Inter } from "next/font/google";
import { Typography } from "antd";

const inter = Inter({ subsets: ["latin"] });

export default function Profile() {
  return (
    <>
      <Typography.Paragraph>
        This is where users will be able to see info regarding their profile.
      </Typography.Paragraph>
    </>
  );
}