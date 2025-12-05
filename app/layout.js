import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AudioProvider } from "@/components/providers/AudioProvider";
import { EscapeProvider } from "@/components/providers/EscapeProvider";

export const metadata = {
  title: "SpookBnB - Your Perfect Getaway",
  description: "Experience the vacation of a lifetime at SpookBnB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AudioProvider>
            <EscapeProvider>
              {children}
            </EscapeProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
