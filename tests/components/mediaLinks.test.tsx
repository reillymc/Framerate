import { openBrowserAsync } from "expo-web-browser";
import { fireEvent, render } from "@testing-library/react-native";

import { MediaLinks } from "@/components/mediaLinks";
import { MediaType } from "@/constants/mediaTypes";

jest.mock("expo-web-browser", () => ({
    openBrowserAsync: jest.fn(),
}));

describe("MediaLinks", () => {
    beforeEach(() => {
        (openBrowserAsync as jest.Mock).mockClear();
    });

    it("replaces link placeholders and calls openBrowserAsync", () => {
        const { getByRole } = render(
            <MediaLinks
                mediaType={MediaType.Movie}
                imdbId="tt001122"
                tmdbId={12345}
                seasonNumber={2}
                episodeNumber={3}
                mediaExternalLinks={[
                    {
                        name: "Example",
                        enabled: true,
                        icon: {
                            uri: "https://example.com/icon.png",
                            uriDark: "https://example.com/icon-dark.png",
                        },
                        links: {
                            movie: "https://example.com/{{imdbId}}/{{tmdbId}}/{{seasonNumber}}/{{episodeNumber}}",
                        },
                    },
                ]}
            />,
        );

        const link = getByRole("link");
        fireEvent.press(link);

        expect(openBrowserAsync).toHaveBeenCalledTimes(1);
        expect(openBrowserAsync).toHaveBeenCalledWith(
            "https://example.com/tt001122/12345/2/3",
        );
    });

    it("does not render a link when placeholders remain undefined", () => {
        const { queryByRole } = render(
            <MediaLinks
                mediaType={MediaType.Movie}
                imdbId="tt001122"
                tmdbId={12345}
                mediaExternalLinks={[
                    {
                        name: "Example",
                        enabled: true,
                        icon: {
                            uri: "https://example.com/icon.png",
                            uriDark: "https://example.com/icon-dark.png",
                        },
                        links: {
                            movie: "https://example.com/{{imdbId}}/{{tmdbId}}/{{seasonNumber}}/{{episodeNumber}}",
                        },
                    },
                ]}
            />,
        );

        expect(queryByRole("link")).toBeNull();
        expect(openBrowserAsync).not.toHaveBeenCalled();
    });
});
