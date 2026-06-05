import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.breadcraft.recipes",
  appName: "Breadcraft",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
