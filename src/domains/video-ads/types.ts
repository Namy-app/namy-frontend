// Video Ads Domain Types

export interface VideoAd {
  id: string;
  videoKey: string;
  videoUrl: string;
  thumbnailKey?: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
  mimeType: string;
  active: boolean;
  priority: number;
  impressionCount: number;
  watchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoAdPair {
  ads: VideoAd[];
  sessionId: string;
}

export interface WatchVideoAdInput {
  videoAdId: string;
  videoKey: string;
  watchDuration: number; // in seconds
  deviceId?: string;
  sessionId?: string;
}

export interface WatchAdResponse {
  success: boolean;
  canGenerateCoupon: boolean;
  remaining?: number;
  token?: string;
  adsWatched?: number;
}

export interface PresignedUploadUrl {
  uploadUrl: string;
  videoKey: string;
  publicUrl: string;
}

export interface RequestVideoUploadInput {
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface CreateVideoAdInput {
  videoKey: string;
  title: string;
  description?: string;
  duration: number;
  fileSize: number;
  mimeType: string;
  priority?: number;
}

export interface UpdateVideoAdInput {
  id: string;
  title?: string;
  description?: string;
  active?: boolean;
  priority?: number;
}
