import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Life Echo - Record Life As It Happens",
  description: "Voice-activated journaling and location tracking mobile application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${leagueSpartan.variable} antialiased bg-white text-gray-900`}
      >
        <div className="max-w-[864px] mx-auto min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
