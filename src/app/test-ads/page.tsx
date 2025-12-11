import { AdUnit } from '@/components/AdUnit';

export default function TestAdsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">Test Ads Page</h1>
          <p className="text-gray-600 mb-4">
            This page displays test AdSense ads. Test ads show placeholder
            content and don't generate revenue.
          </p>
        </div>

        {/* Banner Ad */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Banner Ad (Horizontal)
          </h2>
          <AdUnit
            slot="1234567890" // Replace with your actual ad slot ID
            format="horizontal"
            style={{ minHeight: '90px' }}
          />
        </div>

        {/* Rectangle Ad */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Rectangle Ad</h2>
          <AdUnit
            slot="1234567890" // Replace with your actual ad slot ID
            format="rectangle"
            style={{ minHeight: '250px' }}
          />
        </div>

        {/* Responsive Ad */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Responsive Ad (Auto)
          </h2>
          <AdUnit
            slot="1234567890" // Replace with your actual ad slot ID
            format="auto"
            responsive={true}
            style={{ minHeight: '200px' }}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Note about Test Ads:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              Test ads are enabled with <code>data-adtest="on"</code>
            </li>
            <li>Replace slot IDs with your actual ad unit slot IDs</li>
            <li>
              Test ads show placeholder content (blank or test patterns)
            </li>
            <li>Remove <code>data-adtest="on"</code> for production</li>
            <li>
              Alternatively, use Google AdSense test device settings in your
              AdSense account
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
