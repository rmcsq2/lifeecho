import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
        className={`${leagueSpartan.variable} antialiased bg-background text-foreground transition-colors duration-300`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)'
        }}
      >
        <ThemeProvider>
          <div className="max-w-[864px] mx-auto min-h-screen transition-colors duration-300" 
               style={{ backgroundColor: 'var(--background)' }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
