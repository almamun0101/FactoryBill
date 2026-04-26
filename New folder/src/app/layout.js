import BottomNav from './component/BottomNav';
import './globals.css';


export const metadata = {
  title: 'Factory Mentaince',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen flex flex-col">
        {/* Main page content */}
        <main className="flex-1 pb-16">{children}</main>

        {/* Fixed bottom navbar */}
        <BottomNav />
      </body>
    </html>
  );
}
