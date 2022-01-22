import {Navigation} from "@shopify/polaris";
import {HeartMajor, HomeMajor} from "@shopify/polaris-icons";
import {useRouter} from "next/router";
import React from "react";
import {UsePictureOfTheDayStorage} from "./hooks/usePictureOfTheDayStorage";

export const NavBar: React.FC<{ savedSearches: UsePictureOfTheDayStorage }> = ({savedSearches}) => {
    const router = useRouter();
    return <Navigation location={router.asPath}>
        <Navigation.Section
            items={[
                {
                    url: '/discover',
                    label: 'Discover',
                    icon: HomeMajor,
                },
                {
                    url: '/liked',
                    label: 'Liked',
                    icon: HeartMajor,
                    badge: savedSearches.count,
                },
            ]}
        />
    </Navigation>
};
