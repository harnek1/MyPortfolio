export default{
  expo: {
    name: SuperheroApp,
    slug: SuperheroApp,
    platforms: [ios, android, web],
    version: "1.0.0",
    extra: {
      API_KEY: process.env.API_KEY
    },
    orientation: portrait,
    icon: "./assets/images/favicon.png",
    scheme: myapp,
    userInterfaceStyle: automatic,
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: metro
    },
    plugins: [
      expo-router,
      [
        expo-splash-screen,
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: contain,
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
}
