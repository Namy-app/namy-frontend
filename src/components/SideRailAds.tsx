'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SideRailAdsProps {
  children: React.ReactNode;
}

// Routes where side rail ads should NOT appear
const EXCLUDED_ROUTES = ['/', '/auth', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];

/**
 * SideRailAds - Displays ads on the left and right sides of the main content
 * Only visible on screens wider than 1400px (content is 1200px + space for ads)
 * Excluded from landing page and auth pages
 */
export function SideRailAds({ children }: SideRailAdsProps): React.JSX.Element {
  const [isWideScreen, setIsWideScreen] = useState(false);
  const pathname = usePathname();

  // Check if current route should show ads
  const shouldShowAds = !EXCLUDED_ROUTES.includes(pathname);

  useEffect(() => {
    const checkWidth = () => {
      setIsWideScreen(window.innerWidth >= 1400);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const showSideRails = isWideScreen && shouldShowAds;

  return (
    <div className="relative min-h-screen">
      {/* Left Side Rail Ad */}
      {showSideRails && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden xl:block" style={{ width: 'calc((100vw - 1200px) / 2 - 20px)', maxWidth: '160px', marginLeft: '10px' }}>
          <div className="sticky top-20">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg p-2 text-center">
              <p className="text-[10px] text-gray-500 mb-1">Advertisement</p>
              <div className="bg-white rounded h-[600px] flex items-center justify-center border border-dashed border-gray-300">
                <div className="text-center p-2">
                  <div className="text-4xl mb-2">📢</div>
                  <p className="text-xs text-gray-400">Ad Space</p>
                  <p className="text-[10px] text-gray-300">160x600</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Right Side Rail Ad */}
      {showSideRails && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden xl:block" style={{ width: 'calc((100vw - 1200px) / 2 - 20px)', maxWidth: '160px', marginRight: '10px' }}>
          <div className="sticky top-20">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-lg p-2 text-center">
              <p className="text-[10px] text-gray-500 mb-1">Advertisement</p>
              <div className="bg-white rounded h-[600px] flex items-center justify-center border border-dashed border-gray-300">
                <div className="text-center p-2">
                  <div className="text-4xl mb-2">📢</div>
                  <p className="text-xs text-gray-400">Ad Space</p>
                  <p className="text-[10px] text-gray-300">160x600</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
