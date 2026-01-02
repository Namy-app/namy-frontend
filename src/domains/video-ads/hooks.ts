// Video Ads Hooks using React Query

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { graphqlClient } from "@/lib/graphql-client";
import {
  REQUEST_VIDEO_UPLOAD_MUTATION,
  CREATE_VIDEO_AD_MUTATION,
  UPDATE_VIDEO_AD_MUTATION,
  DELETE_VIDEO_AD_MUTATION,
  GET_ALL_VIDEO_ADS_QUERY,
  GET_VIDEO_AD_PAIR_QUERY,
  WATCH_VIDEO_AD_MUTATION,
} from "@/lib/graphql-queries";

import type {
  VideoAd,
  VideoAdPair,
  PresignedUploadUrl,
  RequestVideoUploadInput,
  CreateVideoAdInput,
  UpdateVideoAdInput,
  WatchVideoAdInput,
  WatchAdResponse,
} from "./types";

// ============ USER HOOKS ============

/**
 * Get a pair of video ads to watch
 */
export function useGetVideoAdPair(deviceId?: string) {
  return useQuery<VideoAdPair>({
    queryKey: ["video-ad-pair", deviceId],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        getVideoAdPair: VideoAdPair;
      }>(GET_VIDEO_AD_PAIR_QUERY, { deviceId });
      return data.getVideoAdPair;
    },
    staleTime: 0, // Always fetch fresh ads
    gcTime: 0, // Don't cache
  });
}

/**
 * Track video ad watch
 */
export function useWatchVideoAd() {
  return useMutation<WatchAdResponse, Error, WatchVideoAdInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        watchVideoAd: WatchAdResponse;
      }>(WATCH_VIDEO_AD_MUTATION, { input });
      return data.watchVideoAd;
    },
    // Don't invalidate queries - we want to keep the same ad pair for the session
  });
}

// ============ SUPER ADMIN HOOKS ============

/**
 * Request presigned URL for video upload (super admin only)
 */
export function useRequestVideoUpload() {
  return useMutation<PresignedUploadUrl, Error, RequestVideoUploadInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        requestVideoUpload: PresignedUploadUrl;
      }>(REQUEST_VIDEO_UPLOAD_MUTATION, { input });
      return data.requestVideoUpload;
    },
  });
}

/**
 * Create a new video ad (super admin only)
 */
export function useCreateVideoAd() {
  const queryClient = useQueryClient();

  return useMutation<VideoAd, Error, CreateVideoAdInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        createVideoAd: VideoAd;
      }>(CREATE_VIDEO_AD_MUTATION, { input });
      return data.createVideoAd;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["video-ads"] });
    },
  });
}

/**
 * Update a video ad (super admin only)
 */
export function useUpdateVideoAd() {
  const queryClient = useQueryClient();

  return useMutation<VideoAd, Error, UpdateVideoAdInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        updateVideoAd: VideoAd;
      }>(UPDATE_VIDEO_AD_MUTATION, { input });
      return data.updateVideoAd;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["video-ads"] });
    },
  });
}

/**
 * Delete a video ad (super admin only)
 */
export function useDeleteVideoAd() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => {
      const data = await graphqlClient.request<{
        deleteVideoAd: boolean;
      }>(DELETE_VIDEO_AD_MUTATION, { id });
      return data.deleteVideoAd;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["video-ads"] });
    },
  });
}

/**
 * Get all video ads (super admin only)
 */
export function useGetAllVideoAds() {
  return useQuery<VideoAd[]>({
    queryKey: ["video-ads", "all"],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        getAllVideoAds: VideoAd[];
      }>(GET_ALL_VIDEO_ADS_QUERY);
      return data.getAllVideoAds;
    },
  });
}
