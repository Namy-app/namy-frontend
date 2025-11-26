"use client";

import Image from "next/image";

export function PageFooter(): React.JSX.Element {
  return (
    <div className="text-center py-8 px-6">
      <Image
        src="/namy-logo.webp"
        alt="Ñamy"
        width={32}
        height={32}
        className="h-8 w-auto mx-auto mb-2 opacity-50 rounded-lg"
      />
      <p className="text-sm text-muted-foreground">
        Come inteligente, ahorra más 🍴💚
      </p>
    </div>
  );
}
