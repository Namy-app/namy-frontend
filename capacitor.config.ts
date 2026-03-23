import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "namyapp.com",
  appName: "namyapp",
  webDir: "out",
  server: {
    errorPath: "404.html",
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "LIGHT",
      backgroundColor: "#ffffff",
    },
  },
};

export default config;
