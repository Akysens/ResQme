module.exports = {
  expo: {
    scheme: "resqme",
    name: "ResQme",
    slug: "ResQme",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./src/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#D9D9D9",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.Help.Hub",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH",
        "android.permission.ACCESS_WIFI_STATE",
        "android.permission.CHANGE_WIFI_STATE",
        "android.permission.BLUETOOTH_ADVERTISE",
        "android.permission.BLUETOOTH_CONNECT",
        "android.permission.BLUETOOTH_SCAN",
        "android.permission.NEARBY_WIFI_DEVICES",
      ],
      userInterfaceStyle: "light",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAP_KEY,
        },
      },
    },
    web: {
      favicon: "./src/assets/ResQme_favicon.png",
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
        }
      ],
      [
        "expo-font",
        {
          "fonts": ["src/assets/OpenSans.ttf"]
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "7439e976-f17d-4b78-a74e-6cc292acc4f9",
      },
    },
    owner: "Bmanzur\nEaksay\nSdusnoki\nSnjora",
  },
};
