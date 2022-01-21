import {
    Button,
    Card,
    DatePicker,
    DisplayText,
    Frame,
    Navigation,
    TextContainer,
    TextStyle,
    TopBar
} from "@shopify/polaris";
import {
    CircleMinusMajor,
    ColorsMajor,
    HeartMajor,
    HomeMajor,
    SaveMinor,
} from "@shopify/polaris-icons";
import React, {useState} from "react";
import {useThemeApi} from "../hooks/useThemeApi";
import {useRouter} from "next/router";
import {
    MemoryInstantSearchAdapter
} from "./search/client/memoryInstantSearchAdapter";
import {Hits, SearchBox} from "./search/instantSearch";
import {Configure, InstantSearch} from "react-instantsearch-dom";
import {fakeData} from "./test/data";
import {PictureOfTheDayData, UsePictureOfTheDay} from "./db/usePictureOfTheDay";

export const DatePickerMulti = () => {
    const [{month, year}, setDate] = useState({month: 1, year: 2018});
    const [selectedDates, setSelectedDates] = useState({
        start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
        end: new Date('Mon Mar 12 2018 00:00:00 GMT-0500 (EST)'),
    });

    const handleMonthChange = (month, year) => setDate({month, year})

    return (
        <DatePicker
            month={month}
            year={year}
            onChange={setSelectedDates}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
            multiMonth
            allowRange
        />
    );
}

export const Layout: React.FC = ({children}) => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const {toggleTheme} = useThemeApi()
    const router = useRouter();
    const savedSearches = new UsePictureOfTheDay('spacetagramData');

    return (
        <InstantSearch
            searchClient={new MemoryInstantSearchAdapter(fakeData, savedSearches, {
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
                                <div className={'spacetagram-theme-button'}>
                                    <Button onClick={toggleTheme}
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
                <Hits
                    HitsComponent={({hits}: { hits: PictureOfTheDayData[] }) => {
                        return hits.map((hit) => {
                            return <Card
                                key={hit.hitKey}
                                title={<div>
                                    <DisplayText
                                        element={'h2'}>{hit.title}</DisplayText
                                    >
                                    <DisplayText
                                        size="small"
                                        element={'h3'}>{hit.date.toDateString()}</DisplayText>
                                </div>} actions={[]}
                                primaryFooterAction={{
                                    icon: hit.isSaved ? CircleMinusMajor : HeartMajor,
                                    onAction() {
                                        hit.isSaved
                                            ? savedSearches.removeItem(hit.hitKey) :
                                            savedSearches.addItem(hit.hitKey, hit);
                                    }
                                }
                                }
                                sectioned={true}
                                footerActionAlignment={'right'}>
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
