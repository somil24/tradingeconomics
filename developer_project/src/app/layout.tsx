import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Country analyser",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="bg-background-te w-full py-3">
          <div className="flex flex-col mx-24">
            <span className="text-secondary-te font-bold text-xl">Trading</span>
            <span className="text-primary-te font-bold text-xl">Economics</span>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
