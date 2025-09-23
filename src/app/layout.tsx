import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "NoteSpy",
  description: "Shazam clone for the web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
