import {Navigation} from "@shopify/polaris";
import {HomeMajor, SaveMinor} from "@shopify/polaris-icons";
import React from "react";
import {Page} from "./components/page";

export default () => {
    return (
        <Page title={"Spacetagram"}>
            <header>
                <Navigation location="/">
                    <Navigation.Section
                        items={[
                            {
                                url: '/',
                                label: 'Discover',
                                icon: HomeMajor,
                            },
                            {
                                url: '/saved',
                                label: 'Saved',
                                icon: SaveMinor,
                            },
                        ]}
                    />
                </Navigation>
            </header>
            <main>

            </main>
            <footer></footer>
        </Page>
    );
};
