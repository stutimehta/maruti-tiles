import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marutitiles.com"),

  title: {
    default: "Maruti Tiles | Premium Tiles in Surat, Gujarat",
    template: "%s | Maruti Tiles",
  },

  description:
    "Maruti Tiles offers premium large-format and parking tiles for residential, commercial and architectural projects from Surat, Gujarat.",

  keywords: [
    "Maruti Tiles",
    "tiles in Surat",
    "premium tiles Surat",
    "large format tiles",
    "parking tiles",
    "tiles Gujarat",
    "Morbi tiles",
    "premium tiles",
    "floor tiles",
    "wall tiles",
  ],

  authors: [
    {
      name: "Maruti Tiles",
    },
  ],

  creator: "Maruti Tiles",
  publisher: "Maruti Tiles",

  applicationName: "Maruti Tiles",

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://marutitiles.com",
    siteName: "Maruti Tiles",
    title: "Maruti Tiles | Premium Tiles in Surat, Gujarat",
    description:
      "Premium tiles for refined residential, commercial and architectural spaces.",
    images: [
      {
        url: "/images/brand/logo.png",
        width: 512,
        height: 512,
        alt: "Maruti Tiles",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Maruti Tiles | Premium Tiles in Surat, Gujarat",
    description:
      "Premium large-format and parking tiles for residential, commercial and architectural projects.",
    images: ["/images/brand/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/images/brand/logo.png",
    shortcut: "/images/brand/logo.png",
    apple: "/images/brand/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#11100e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}