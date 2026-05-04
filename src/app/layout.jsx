import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import CustomScrollbar from "./components/CustomScrollbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Action Car Detailing Winnipeg | Car Wash, PPF & Ceramic Coating",
    template: "%s | Action Car Detailing Winnipeg",
  },
  description:
    "Professional car detailing in Winnipeg. Expert ceramic coating, PPF, window tinting & car wash services. Book your appointment today at Action Car Detailing.",
  alternates: {
    canonical: "https://actioncardetailing.ca/",
  },
  openGraph: {
    title: "Action Car Detailing Winnipeg | Car Wash, PPF & Ceramic Coating",
    description:
      "Professional car detailing in Winnipeg. Ceramic coating, PPF, window tinting & full car wash services.",
    url: "https://actioncardetailing.ca/",
    siteName: "Action Car Detailing",
    images: [
      {
        url: "https://actioncardetailing.ca/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Action Car Detailing Winnipeg",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Action Car Detailing Winnipeg",
    description:
      "Expert car wash, PPF, ceramic coating & window tinting in Winnipeg.",
    images: ["https://actioncardetailing.ca/og-image.jpg"],
  },
  keywords: ["car detailing Winnipeg", "ceramic coating", "paint protection film", "PPF", "window tinting", "car wash", "auto detailing", "Action Car Detailing"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: '#1393c4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CustomScrollbar />
        <Navbar />
        {children}
        <ChatBot />
      </body>
    </html>
  );
}