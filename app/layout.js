import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { TeamsProvider } from "./TeamsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OKR Tree - Microsoft Teams App",
  description: "Track your objectives and key results with OKR Tree",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TeamsProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </TeamsProvider>
      </body>
    </html>
  );
}
