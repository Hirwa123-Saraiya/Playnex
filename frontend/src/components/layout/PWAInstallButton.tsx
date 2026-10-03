'use client'; // Required because we are using browser window listeners

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react'; // Reusing your existing icons

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the browser's default prompt from taking over automatically
      e.preventDefault();
      // Store the event so we can trigger it later when the button is clicked
      setDeferredPrompt(e);
      // Make our custom button visible
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If the app is already installed, hide the button
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the native browser installation confirmation popup
    deferredPrompt.prompt();

    // Wait for the user to choose to install or cancel
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
      setIsVisible(false); // Hide the button since they installed it
    }
    
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all w-full sm:w-auto shadow-lg shadow-emerald-950/20 animate-pulse"
    >
      <Download className="w-4 h-4" />
      Install Desktop App
    </button>
  );
}
