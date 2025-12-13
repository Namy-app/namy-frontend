import {
  getDiscountPercentage,
  getLevelName,
  type UserLevel,
} from "@/lib/discount-utils";

interface DiscountBadgeProps {
  userLevel: UserLevel;
  isPremium?: boolean;
  className?: string;
}

/**
 * DiscountBadge - Displays the discount percentage for a user's level
 * Premium users always get the highest discount (15%)
 */
export function DiscountBadge({
  userLevel,
  isPremium = false,
  className = "",
}: DiscountBadgeProps) {
  const discountPercentage = getDiscountPercentage(userLevel, isPremium);
  const levelName = getLevelName(userLevel, isPremium);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-primary font-semibold">
        -{discountPercentage}% off
      </span>
      <span className="text-xs text-muted-foreground">({levelName})</span>
    </div>
  );
}
