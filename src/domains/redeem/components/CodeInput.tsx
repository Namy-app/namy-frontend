"use client";

type Props = {
  couponCode: string;
  setCouponCode: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CodeInput({
  couponCode,
  setCouponCode,
  onSubmit,
}: Props): React.JSX.Element {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-muted-foreground">
            OR ENTER MANUALLY
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="couponCode"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          Coupon Code
        </label>
        <input
          id="couponCode"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-lg tracking-wider uppercase"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all flex items-center justify-center gap-2"
      >
        Continue
      </button>

      <div className="bg-muted/50 p-4 rounded-xl">
        <p className="text-xs text-muted-foreground text-center">
          You will be asked for your store PIN in the next step
        </p>
      </div>
    </form>
  );
}
