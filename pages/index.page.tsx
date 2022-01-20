import React from "react";
import {Page} from "./lib/page";
import {Header} from "./lib/navBar";

export default () => {
    return (
        <Header title={"Spacetagram"}>
            <header>
                <Header/>
                {/*<Navigation location="/">*/}
                {/*    <Navigation.Section*/}
                {/*        items={[*/}
                {/*            {*/}
                {/*                url: '/',*/}
                {/*                label: 'Discover',*/}
                {/*                icon: HomeMajor,*/}
                {/*            },*/}
                {/*            {*/}
                {/*                url: '/saved',*/}
                {/*                label: 'Saved',*/}
                {/*                icon: SaveMinor,*/}
                {/*            },*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*</Navigation>*/}
            </header>
            <main>

            </main>
            <footer></footer>
        </Header>
    );
};
