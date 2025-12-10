import { useAuthStore } from "@/store/useAuthStore";

export async function exchangeUnlockToken({
  token,
  discountId,
}: {
  token: string;
  discountId: string;
}) {
  const state = useAuthStore.getState();
  const t = state.accessToken;
  if (!t) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/ads/exchange`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({ token, discountId }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Exchange failed: ${res.status} ${text}`);
  }

  return res.json();
}
