# Framerate

Framerate is a movie and TV watch journal that tracks ratings and viewing habits over time. With this data, Framerate helps users identify trends in their viewing preferences and refine their opinions.

<a href="https://apps.apple.com/au/app/framerate/id6741703626?itscg=30200&itsct=apps_box_badge&mttnsubad=6741703626" style="display: inline-block;">
<img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1739664000" alt="Download on the App Store" style="width: 246px; height: 82px; vertical-align: middle; object-fit: contain;" />
</a>

## Features

-   **Movie and TV Show Support**: Track movies and TV shows.
-   **Watch History**: Record and store watches.
-   **Review Recording and History**: Write reviews and track ratings for watches.
-   **Watchlisting**: Create a list of shows or movies to watch.
-   **Upcoming and Popular Media**: View upcoming releases and popular titles.

## Development

The provided dev container sets up a pre-configured development environment for React Native / Expo.

To run the server and watch for changes, use: `npm start`.

A core dependency of the project is the [@reillymc/react-native-components](https://github.com/reillymc/ReactNativeComponents/pkgs/npm/react-native-components) package.
This is currently hosted as a private github packages and requires [authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages). This will be made public in future.

### Architecture

Framerate is built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).

## Deployment

The NPM scripts `build:ios` and `build:android` prepare the project for building and distribution via XCode and Android Studio. The app can also be exported for expo web.

## Contributing

Pull requests are welcome if they are within the the projects current scope and / or goals, otherwise raise an issue and I would be happy to discuss problems or suggestions.
