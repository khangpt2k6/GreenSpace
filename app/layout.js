import "./globals.css";
import MotionInit from "@/components/motion-init";

export const metadata = {
  title: "GreenCart - Sustainable Product Intelligence",
  description:
    "Analyze product pages with AI, understand environmental impact, and discover greener alternatives."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MotionInit />
        {children}
      </body>
    </html>
  );
}
