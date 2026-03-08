import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SpaceBackground from "../components/SpaceBackground";

export default function MainLayout({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 dark:bg-transparent">
      
      {/* Global Dark Mode Cosmic Background */}
      <div className="hidden dark:block fixed inset-0 z-[-10] pointer-events-none">
        <SpaceBackground status="idle" />
      </div>

      <Navbar className="relative z-10" />

      <div className="flex-1 p-10 relative z-10 w-full">
        {children}
      </div>
      
      <Footer className="relative z-10" />
    </div>
  );
}