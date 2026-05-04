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
    "Professional car detailing services in Winnipeg. We offer the best auto ceramic coating, XPEL paint protection film, window tinting, and vehicle detailing near me. Book today at Action Car Detailing.",
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
  keywords: [
    // Primary Final Keywords
    "xpel paint protection film", "ceramic coating", "best auto ceramic coating", "vehicle detailing near me", "car detailing services",
    // Ceramic Coating
    "fusion plus ceramic coating", "xpel ceramic coating", "best ceramic coating", "best ceramic coating for cars", "ceramic coating winnipeg", "best automotive ceramic coating", "ceramic coating car", "coating car",
    // Detailing
    "interior car detailing near me", "interior car cleaning", "car interior detailing", "interior detailing near me", "car cleaning", "detailing car near me", "car wash and detail near me", "auto interior detailing", "car cleaners near me", "auto detailing prices", "car wash and detail", "car cleaning and detailing near me", "car wash near me full service", "Car Cleaning Winnipeg", "Interior car cleaning Winnipeg", "Car detailing Winnipeg", "Interior car detailing Winnipeg", "Luxury car detailing winnipeg", "Best car detailing Winnipeg", "vehicle detailing winnipeg", "winnipeg detailing", "car cleaning winnipeg", "car shampoo winnipeg", "car wash winnipeg mb",
    // Window Tint
    "window tint", "xpel window tint", "window films", "automotive window tint", "auto window tint", "car window tint", "window tint winnipeg",
    // Paint Protection Film
    "xpel ppf", "ppf near me", "paint protection film near me", "car paint protection film", "car ppf near me", "auto paint protection near me", "paint protection film winnipeg", "paint protection winnipeg", "paint protection film canada"
  ],
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