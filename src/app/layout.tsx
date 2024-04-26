import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";

const fontSans = Noto_Sans({ subsets: ["latin"] });
const fontSerif = Noto_Serif({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EPPL",
  description: "EPPL Internal Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSerif.className} antialiased`}>{children}</body>
    </html>
  );
}
