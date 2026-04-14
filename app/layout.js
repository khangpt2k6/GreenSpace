import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import MotionInit from "@/components/motion-init";
import ChatBubble from "@/components/chat-bubble";
import ThemeProvider from "@/components/theme-provider";

export const metadata = {
  title: "GreenCart - Sustainable Product Intelligence",
  description:
    "Analyze product pages with AI, understand environmental impact, and discover greener alternatives."
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth" data-theme="light">
        <body>
          <ThemeProvider>
            <MotionInit />
            {children}
            <ChatBubble />
            <footer className="siteCredit">
              Powered by Tuan Khang Phan - IDH 3350
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
