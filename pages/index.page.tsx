import React, {useEffect, useRef, useState} from "react";
import {Page} from "./lib/page";
import {Highlight, Hits, SearchBox} from "./lib/search/instantSearch";
import {
    PictureOfTheDayData,
    UsePictureOfTheDay
} from "./lib/db/usePictureOfTheDay";
import {
    Button,
    Card,
    DisplayText,
    Frame,
    Loading,
    Navigation,
    TextContainer,
    TextStyle,
    TopBar
} from "@shopify/polaris";
import {
    CircleMinusMajor,
    ColorsMajor,
    HeartMajor,
    HomeMajor
} from "@shopify/polaris-icons";
import {WithSearch} from "./lib/withSearch";
import {UseSearchClient} from "./hooks/useSearchClient";
import {useThemeApi} from "./hooks/useThemeApi";
import {useRouter} from "next/router";


export default () => {
    const savedSearches = new UsePictureOfTheDay('spacetagramData');
    const client = new UseSearchClient(savedSearches)

    useEffect(() => {
        client.fetchRandom()
    }, []);

    return (

        <Page title={"Spacetagram"}>
            <WithSearch searchClient={client.data.client}
                        Frame={({children}) => {
                            const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
                            const {toggleTheme} = useThemeApi()
                            const router = useRouter();
                            const skipToContentRef = useRef(null);
                            return <Frame
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
                                                    label: 'Liked',
                                                    icon: HeartMajor,
                                                    badge: savedSearches.count,
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
                                                <div
                                                    className={'spacetagram-theme-button'}>
                                                    <Button
                                                        onClick={toggleTheme}
                                                        icon={ColorsMajor}
                                                        accessibilityLabel={'Toggle dark and light theme'}/>
                                                </div>
                                            }
                                            searchResultsVisible={false}
                                            searchField={
                                                <SearchBox/>
                                            }
                                            onNavigationToggle={() => setIsNavMenuOpen(current => !current)}
                                        />
                                    </header>
                                }>
                                <a id="SkipToContentTarget"
                                   ref={skipToContentRef}
                                   tabIndex={-1}/>
                                {children}
                                <footer/>
                            </Frame>
                        }}
            >{
                client.data.loading ? <Loading/> :
                    <>
                        <div className={'spacetagram-date-control'}>
                            <Button
                                onClick={() => client.fetchRandom()}>Random</Button>
                            <DisplayText element={'p'}>Remaining
                                Queries: {client.data.remaining}</DisplayText>
                        </div>
                        <Hits
                            HitsComponent={({hits}: { hits: PictureOfTheDayData[] }) => {
                                return hits.map((hit) => {

                                    const MediaComponent = hit.media_type === 'image' ? (
                                        <figure>
                                            <a href={hit.url}
                                               rel="noopener noreferrer"
                                               target="_blank">
                                                <img
                                                    src={hit.url}
                                                    alt={hit.title}
                                                />
                                            </a>
                                            {hit.copyright && <figcaption>
                                                <TextStyle
                                                    variation="subdued"><strong
                                                    aria-label={'Copyright'}>{'\u24B8 '}</strong>
                                                    {hit.copyright}
                                                </TextStyle>
                                            </figcaption>}
                                        </figure>) : (
                                        <iframe width="420" height="315"
                                                src={hit.url}>
                                        </iframe>
                                    );

                                    const isSaved = savedSearches.hasKey(hit.hitKey)
                                    return <Card
                                        key={hit.hitKey}
                                        title={<div>
                                            <DisplayText
                                                element={'h2'}><Highlight
                                                hit={hit}
                                                attribute={'title'}/>
                                            </DisplayText>
                                            <DisplayText
                                                size="small"
                                                element={'h3'}>{hit.date.toDateString()}</DisplayText>
                                        </div>} actions={[]}
                                        primaryFooterAction={{
                                            icon: isSaved ? CircleMinusMajor : HeartMajor,
                                            onAction() {
                                                isSaved
                                                    ? savedSearches.removeItem(hit.hitKey) :
                                                    savedSearches.addItem(hit.hitKey, hit);
                                            }
                                        }
                                        }
                                        sectioned={true}
                                        footerActionAlignment={'right'}>
                                        <TextContainer spacing={"loose"}>

                                            {MediaComponent}
                                            <DisplayText
                                                size="small"
                                                element={'p'}><Highlight
                                                hit={hit}
                                                attribute={'explanation'}/></DisplayText>
                                        </TextContainer>
                                    </Card>;
                                });
                            }}

                        /></>
            }
            </WithSearch>
        </Page>
    );
};
