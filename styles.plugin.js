const { withAndroidStyles } = require("@expo/config-plugins");

module.exports = function dateTimePickerPlugin(config) {
  return withAndroidStyles(config, async (config) => {
    let androidStyles = config.modResults.resources;

    androidStyles.style = [
      {
        $: {
          name: "AppTheme",
          parent: "Theme.AppCompat.Light.NoActionBar",
        },
        item: [
          {
            $: {
              name: "colorPrimary",
            },
            _: "@color/colorPrimary",
          },
          {
            $: {
              name: "android:windowTranslucentStatus",
            },
            _: "true",
          },
          {
            $: {
              name: "colorPrimaryDark",
            },
            _: "@color/colorPrimaryDark",
          },
          {
            $: {
              name: "android:datePickerDialogTheme",
            },
            _: "@style/Dialog.Theme",
          },
          {
            $: {
              name: "android:timePickerDialogTheme",
            },
            _: "@style/Dialog.Theme",
          },
        ],
      },
      {
        $: {
          name: "Dialog.Theme",
          parent: "Theme.AppCompat.Light.Dialog",
        },
        item: [
          {
            $: {
              name: "colorAccent",
            },
            _: "#434381",
          },
          {
            $: {
              name: "android:textColorPrimary",
            },
            _: "#000000",
          },
        ],
      },
      {
        $: {
          name: "Theme.App.SplashScreen",
          parent: "AppTheme",
        },
        item: [
          {
            $: {
              name: "android:windowBackground",
            },
            _: "@drawable/splashscreen",
          },
        ],
      },
    ];

    return config;
  });
};
