"use client";

import Image from "next/image";

import { Emoji } from "@/components/Emoji";
import { useAppTranslation } from "@/lib/i18n/useAppTranslation";

export function PageFooter(): React.JSX.Element {
  const { t } = useAppTranslation();

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
        {t("ui.eat_smart_save_more")} <Emoji cp="1f374" label="cubiertos" />
        <Emoji cp="1f49a" label={t("ui.green_heart")} />
      </p>
    </div>
  );
}
