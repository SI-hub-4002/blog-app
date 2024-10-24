import Header from "@/components/features/Header/Header";
import Navigation from "@/components/features/Navigation/Navigations";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="jp">
        <body className="relative h-screen bg-slate-50">
          <Navigation />
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
