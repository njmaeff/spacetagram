import {
    Button,
    Card,
    DisplayText,
    Frame,
    Navigation,
    TextContainer,
    TextStyle,
    TopBar
} from "@shopify/polaris";
import {ColorsMajor, HomeMajor, SaveMinor,} from "@shopify/polaris-icons";
import React, {useState} from "react";
import {useThemeApi} from "../hooks/useThemeApi";
import {useRouter} from "next/router";
import {
    MemoryInstantSearchAdapter
} from "./search/client/memoryInstantSearchAdapter";
import {Hits, SearchBox} from "./search/instantSearch";
import {Configure, InstantSearch} from "react-instantsearch-dom";
import {fakeData} from "./test/data";
import {PictureOfTheDayData} from "./db/pictureOfTheDay";

export const Layout: React.FC = ({children}) => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const {toggleTheme} = useThemeApi()
    const router = useRouter();

    return (
        <InstantSearch searchClient={new MemoryInstantSearchAdapter(fakeData, {
            keys: ['title', 'explanation']
        })}
                       indexName={''}>
            <Configure
                hitsPerPage={10}
            />
            <Frame
                showMobileNavigation={isNavMenuOpen}
                onNavigationDismiss={() => setIsNavMenuOpen(current => !current)}
                navigation={
                    <Navigation location={router.asPath}>
                        <Navigation.Section
                            items={[
                                {
                                    url: '/',
                                    label: 'Discover',
                                    icon: HomeMajor,
                                },
                                {
                                    url: '/liked',
                                    label: 'Liked Results',
                                    icon: SaveMinor,
                                    badge: '15',
                                },
                            ]}
                        />
                    </Navigation>
                }
                topBar={
                    <header>
                        <TopBar
                            showNavigationToggle
                            secondaryMenu={
                                <div className={'spacetagram-theme-button'}>
                                    <Button onClick={toggleTheme}
                                            icon={ColorsMajor}
                                            accessibilityLabel={'Toggle dark and light theme'}/>
                                </div>
                            }
                            searchResultsVisible={isSearchActive}
                            searchField={
                                <SearchBox/>
                            }
                            onNavigationToggle={() => setIsNavMenuOpen(current => !current)}
                        />
                    </header>
                }>
                <Hits
                    HitsComponent={({hits}: { hits: PictureOfTheDayData[] }) => {
                        return hits.map((hit) => {
                            return <Card key={hit.date.getTime()} title={<div>
                                <DisplayText
                                    element={'h2'}>{hit.title}</DisplayText
                                >
                                <DisplayText
                                    size="small"
                                    element={'h3'}>{hit.date.toDateString()}</DisplayText>
                            </div>} actions={[]}
                                         footerActionAlignment={'left'}>
                                <TextContainer spacing={"loose"}>

                                    <figure>
                                        <img
                                            src={hit.url}
                                            alt={hit.title}
                                        />
                                        <figcaption>
                                            <TextStyle
                                                variation="subdued"><strong
                                                aria-label={'Copyright'}>{'\u24B8 '}</strong>
                                                {hit.copyright}
                                            </TextStyle>
                                        </figcaption>
                                    </figure>
                                    <DisplayText
                                        size="small"
                                        element={'p'}>{hit.explanation}</DisplayText>
                                </TextContainer>
                            </Card>
                        });
                    }}

                />
                {children}
                <footer/>
            </Frame>
        </InstantSearch>
    );
}
