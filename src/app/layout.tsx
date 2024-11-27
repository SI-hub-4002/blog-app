import Header from "@/components/features/Header";
import Navigation from "@/components/features/Navigations";
import { SessionProviders } from "../../lib/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <title>N-Blog</title> 
      </head>
      <body className="relative h-screen bg-slate-50">
        <SessionProviders>
          <Navigation />
          <Header />
          {children}
        </SessionProviders>
      </body>
    </html>
  );
}
