"use client";

/**
 * BannerAd - Horizontal banner advertisement
 * Displays after the PageFooter section on the explore page
 * Responsive design: full width on mobile, centered with max-width on desktop
 */
export function BannerAd(): React.JSX.Element {
  return (
    <div className="px-4 pb-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg p-2 shadow-lg">
          <p className="text-[10px] text-gray-500 mb-1 text-center">
            Advertisement
          </p>
          <div className="bg-white rounded h-[90px] flex items-center justify-center border border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-3xl mb-1">📢</div>
              <p className="text-xs text-gray-400">Banner Ad Space</p>
              <p className="text-[10px] text-gray-300">728x90</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
