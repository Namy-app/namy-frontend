import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1] ?? dataUrl);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Trigger a file download in the browser via a temporary object URL. */
function downloadBlobOnWeb(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Save a blob to cache and open the native share sheet (Save to Files, AirDrop, etc.).
 * WKWebView cannot open blob: URLs — this is the Capacitor-safe path on iOS/Android.
 */
async function shareBlobOnNative(blob: Blob, filename: string): Promise<void> {
  const base64 = await blobToBase64(blob);
  const { uri } = await Filesystem.writeFile({
    path: filename,
    data: base64,
    directory: Directory.Cache,
  });

  await Share.share({
    title: filename,
    files: [uri],
    dialogTitle: "Export report",
  });
}

function isShareCancelled(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /cancel/i.test(message);
}

/**
 * Download or share a file from a Blob.
 * Web: standard browser download. Native: write to cache + system share sheet.
 */
export async function downloadBlobFile(
  blob: Blob,
  filename: string
): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await shareBlobOnNative(blob, filename);
    } catch (error) {
      if (isShareCancelled(error)) {
        return;
      }
      throw error;
    }
    return;
  }

  downloadBlobOnWeb(blob, filename);
}
