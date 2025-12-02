import { useAuthStore } from "@/store/useAuthStore";

export async function sendRewardEvent({
  rewardToken,
  adUnitId,
  deviceId,
}: {
  rewardToken: string;
  adUnitId: string;
  deviceId?: string;
}) {
  const state = useAuthStore.getState();
  const token = state.accessToken;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/ads/reward`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rewardToken, adUnitId, deviceId }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reward event failed: ${res.status} ${text}`);
  }

  return res.json();
}
