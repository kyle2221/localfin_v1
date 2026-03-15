import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalFin AI — Multi-Model Assistant",
  description:
    "A powerful AI assistant supporting multiple models and 9 specialized task modes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
