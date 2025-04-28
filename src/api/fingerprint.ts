/* eslint-disable @typescript-eslint/no-explicit-any */

interface FingerprintData {
  userAgent: string;
  language: string;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
  timezone: string;
  doNotTrack?: string;
  touchSupport: boolean;
  canvasFingerprint?: string;
  webglVendor?: string;
  webglRenderer?: string;
  fonts: string[];
}

export async function getFingerprintData(): Promise<FingerprintData> {
  const canvasFingerprint = getCanvasFingerprint();
  const { webglVendor, webglRenderer } = getWebGLInfo();

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    doNotTrack: navigator.doNotTrack ? navigator.doNotTrack : undefined,
    touchSupport: navigator.maxTouchPoints > 0,
    canvasFingerprint,
    webglVendor,
    webglRenderer,
    fonts: detectFonts(),
  };
}

function getCanvasFingerprint(): string | undefined {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) return undefined;

    ctx.fillStyle = "#f60";
    ctx.fillRect(100, 10, 80, 30);
    ctx.fillStyle = "#069";
    ctx.font = "18pt Arial";
    ctx.fillText("🎯 Fingerprint", 10, 40);

    const data = ctx.getImageData(0, 0, 200, 50).data;
    return Array.from(data).slice(0, 50).join(",");
  } catch {
    return undefined;
  }
}

function getWebGLInfo(): { webglVendor?: string; webglRenderer?: string } {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return {};

    const debugInfo = (gl as any).getExtension?.("WEBGL_debug_renderer_info");
    const webglVendor = debugInfo
      ? gl.getParameter((gl as any).UNMASKED_VENDOR_WEBGL)
      : undefined;
    const webglRenderer = debugInfo
      ? gl.getParameter((gl as any).UNMASKED_RENDERER_WEBGL)
      : undefined;

    return { webglVendor, webglRenderer };
  } catch {
    return {};
  }
}

function detectFonts(): string[] {
  const baseFonts = ["monospace", "sans-serif", "serif"];
  const testFonts = [
    "Arial",
    "Courier New",
    "Georgia",
    "Helvetica",
    "Times New Roman",
    "Verdana",
  ];
  const testString = "mmmmmmmmmmlli";
  const testSize = "72px";

  const span = document.createElement("span");
  span.style.fontSize = testSize;
  span.innerText = testString;
  span.style.position = "absolute";
  span.style.left = "-9999px";
  document.body.appendChild(span);

  const defaultWidths: Record<string, number> = {};
  for (const font of baseFonts) {
    span.style.fontFamily = font;
    defaultWidths[font] = span.offsetWidth;
  }

  const detected: string[] = [];
  for (const font of testFonts) {
    for (const base of baseFonts) {
      span.style.fontFamily = `'${font}',${base}`;
      if (span.offsetWidth !== defaultWidths[base]) {
        detected.push(font);
        break;
      }
    }
  }

  document.body.removeChild(span);
  return detected;
}
