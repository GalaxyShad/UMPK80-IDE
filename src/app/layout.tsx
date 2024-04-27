import {ThemeProvider} from "@/components/theme-provider";
import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "UMPK-80",
  description: "Simple and modern intel 8080 based micro PC emulator",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <head>
      <script src="http://localhost:8097"></script>
    </head>
    <body>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
    </body>
    </html>
  );
}
