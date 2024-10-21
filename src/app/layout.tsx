import Header from "@/components/features/Header/Header";
import Navigation from "@/components/features/Navigation/Navigations";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body className="relative h-screen">
        <Navigation />
        <Header />
        {children}
      </body>
    </html>
  );
}
