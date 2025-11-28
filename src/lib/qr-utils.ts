/* eslint-disable @typescript-eslint/await-thenable */
import type { Area } from "react-easy-crop";

// ZXing-based QR scanning helper
export async function scanQRCode(imageData: ImageData): Promise<string | null> {
  try {
    console.warn("🔬 Attempting QR scan with ZXing...");
    console.warn(`Image dimensions: ${imageData.width}x${imageData.height}`);

    const { BrowserQRCodeReader } = await import("@zxing/browser");
    const codeReader = new BrowserQRCodeReader();

    const base = document.createElement("canvas");
    base.width = imageData.width;
    base.height = imageData.height;
    const bctx = base.getContext("2d");
    if (!bctx) {
      return null;
    }
    bctx.putImageData(imageData, 0, 0);

    const tryDecodeCanvas = async (
      c: HTMLCanvasElement
    ): Promise<string | null> => {
      try {
        const r = await codeReader.decodeFromCanvas(c);
        if (r) {
          return r.getText();
        }
      } catch (e) {
        console.warn("ZXing decodeFromCanvas attempt failed:", e);
      }
      return null;
    };

    const buildCanvasFrom = (
      src: HTMLCanvasElement,
      opts: {
        invert?: boolean;
        rotate?: number;
        downscale?: number;
        threshold?: number;
      } = {}
    ): HTMLCanvasElement | null => {
      const sctx = src.getContext("2d");
      if (!sctx) {
        return null;
      }
      const w = opts.downscale
        ? Math.max(1, Math.round(src.width * opts.downscale))
        : src.width;
      const h = opts.downscale
        ? Math.max(1, Math.round(src.height * opts.downscale))
        : src.height;
      const out = document.createElement("canvas");
      out.width = w;
      out.height = h;
      const octx = out.getContext("2d");
      if (!octx) {
        return out;
      }

      octx.drawImage(src, 0, 0, src.width, src.height, 0, 0, w, h);
      const id = octx.getImageData(0, 0, out.width, out.height);
      const data = id.data;

      if (opts.invert || typeof opts.threshold === "number") {
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]!,
            g = data[i + 1]!,
            b = data[i + 2]!;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (typeof opts.threshold === "number") {
            const v = lum > opts.threshold ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = v;
          }
          if (opts.invert) {
            data[i] = 255 - data[i]!;
            data[i + 1] = 255 - data[i + 1]!;
            data[i + 2] = 255 - data[i + 2]!;
          }
        }
        octx.putImageData(id, 0, 0);
      }

      if (opts.rotate) {
        const rot = document.createElement("canvas");
        if (opts.rotate % 180 === 0) {
          rot.width = out.width;
          rot.height = out.height;
        } else {
          rot.width = out.height;
          rot.height = out.width;
        }
        const rctx = rot.getContext("2d");
        if (rctx) {
          rctx.translate(rot.width / 2, rot.height / 2);
          rctx.rotate((opts.rotate * Math.PI) / 180);
          rctx.drawImage(out, -out.width / 2, -out.height / 2);
        }
        return rot;
      }

      return out;
    };

    const canvasesToTry: (HTMLCanvasElement | null)[] = [base];
    canvasesToTry.push(buildCanvasFrom(base, { invert: true }));
    canvasesToTry.push(buildCanvasFrom(base, { rotate: 90 }));
    canvasesToTry.push(buildCanvasFrom(base, { rotate: 270 }));
    const downscale = Math.min(1, 512 / Math.max(base.width, base.height));
    if (downscale < 1) {
      canvasesToTry.push(buildCanvasFrom(base, { downscale }));
    }
    canvasesToTry.push(buildCanvasFrom(base, { threshold: 128 }));
    canvasesToTry.push(buildCanvasFrom(base, { threshold: 100 }));

    for (const c of canvasesToTry) {
      if (!c) {
        continue;
      }
      const txt = await tryDecodeCanvas(c);
      if (txt) {
        console.warn("✅ ZXing found QR Code (strategy):", txt);
        return txt;
      }
      try {
        const dataUrl = c.toDataURL();
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(true);
          img.onerror = (ev) => reject(ev);
        });
        try {
          const r2 = await codeReader.decodeFromImageElement(
            img as HTMLImageElement
          );
          if (r2) {
            console.warn(
              "✅ ZXing found QR Code via Image element (strategy):",
              r2.getText()
            );
            return r2.getText();
          }
        } catch (_e) {
          console.warn("ZXing decodeFromImageElement failed for strategy:", _e);
        }
      } catch (_) {
        // ignore image load errors
      }
    }

    console.warn("No QR code detected by ZXing");
    return null;
  } catch (err) {
    console.error("QR scanning error:", err);
    return null;
  }
}

export async function createCroppedImage(
  uploadedImage: string | null,
  croppedAreaPixels: Area | null,
  enhance = true
): Promise<ImageData | null> {
  if (!uploadedImage || !croppedAreaPixels) {
    return null;
  }

  return new Promise((resolve) => {
    const image = new window.Image();
    image.onload = () => {
      const MAX_DIM = 1024;
      const requestedWidth = Math.max(1, Math.round(croppedAreaPixels.width));
      const requestedHeight = Math.max(1, Math.round(croppedAreaPixels.height));
      const desiredScale = 2;
      let canvasWidth = Math.round(requestedWidth * desiredScale);
      let canvasHeight = Math.round(requestedHeight * desiredScale);

      if (canvasWidth > MAX_DIM || canvasHeight > MAX_DIM) {
        const scale = Math.min(MAX_DIM / canvasWidth, MAX_DIM / canvasHeight);
        canvasWidth = Math.max(1, Math.round(canvasWidth * scale));
        canvasHeight = Math.max(1, Math.round(canvasHeight * scale));
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (enhance) {
        const data = imageData.data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          sum += 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
        }
        const avg = sum / (data.length / 4 || 1);
        const contrastFactor = 1.2;
        for (let i = 0; i < data.length; i += 4) {
          for (let c = 0; c < 3; c++) {
            let v = (data[i + c]! as number) - avg;
            v = v * contrastFactor + avg;
            data[i + c] = Math.max(0, Math.min(255, Math.round(v)));
          }
        }
        ctx.putImageData(imageData, 0, 0);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      resolve(imageData);
    };
    image.src = uploadedImage;
  });
}
