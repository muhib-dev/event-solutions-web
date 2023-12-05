import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/utils/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Event Solutions",
  description: "An event ticketing solution system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="customTheme">
      <body className={inter.className}>
        <Toaster />
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
