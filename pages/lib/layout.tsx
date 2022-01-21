import {
    Button,
    Card,
    DisplayText,
    Frame,
    Navigation,
    Select,
    TextContainer,
    TextStyle,
    TopBar
} from "@shopify/polaris";
import {
    CircleMinusMajor,
    ColorsMajor,
    HeartMajor,
    HomeMajor,
} from "@shopify/polaris-icons";
import React, {useState} from "react";
import {useThemeApi} from "../hooks/useThemeApi";
import {useRouter} from "next/router";
import {
    MemoryInstantSearchAdapter
} from "./search/client/memoryInstantSearchAdapter";
import {Highlight, Hits, SearchBox} from "./search/instantSearch";
import {Configure, InstantSearch} from "react-instantsearch-dom";
import {fakeData} from "./test/data";
import {PictureOfTheDayData, UsePictureOfTheDay} from "./db/usePictureOfTheDay";
import {eachYearOfInterval, subYears} from "date-fns"

export const dateInterval = eachYearOfInterval({
    start: new Date(2000, 1, 0),
    end: new Date()
}).reverse().map((date) => {
    return {
        label: `${date.getFullYear()}`,
        value: `${date.getTime()}`
    }
})

export const useDateControl = () => {
    const [dateRange, updateDateRange] = useState([
        new Date(dateInterval[0].value),
        new Date(dateInterval[1].value)
    ])

    return {
        dateRange,
        updateDateRange
    } as const

};

export const DateControl: React.FC<ReturnType<typeof useDateControl>> = ({updateDateRange}) => {
    const [selection, updateSelection] = useState("")

    return <div className={'spacetagram-date-control'}>
        <Button>Random</Button>
        <Select
            label="By Year"
            labelInline={true}
            options={dateInterval}
            onChange={(value) => {
                updateSelection(value)
                const end = new Date(value)
                updateDateRange([
                    end,
                    subYears(end, 1)
                ])
            }}
            value={selection}
        />
    </div>
};

export const Layout: React.FC = ({children}) => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const {toggleTheme} = useThemeApi()
    const router = useRouter();
    const savedSearches = new UsePictureOfTheDay('spacetagramData');
    const dateProps = useDateControl();
    return (
        <InstantSearch
            searchClient={new MemoryInstantSearchAdapter(fakeData, savedSearches, {
                keys: ['title', 'explanation'],
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
                <div id="spacetagram-jumpToContent"/>
                <DateControl {...dateProps}/>
                <Hits
                    HitsComponent={({hits}: { hits: PictureOfTheDayData[] }) => {
                        return hits.map((hit) => {

                            const MediaComponent = hit.media_type === 'image' ? (
                                <figure>
                                    <img
                                        src={hit.url}
                                        alt={hit.title}
                                    />
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

                            return <Card
                                key={hit.hitKey}
                                title={<div>
                                    <DisplayText
                                        element={'h2'}><Highlight hit={hit}
                                                                  attribute={'title'}/>
                                    </DisplayText>
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

                                    <a href={hit.url}
                                       rel="noopener noreferrer"
                                       target="_blank">{MediaComponent}</a>
                                    <DisplayText
                                        size="small"
                                        element={'p'}><Highlight hit={hit}
                                                                 attribute={'explanation'}/></DisplayText>
                                </TextContainer>
                            </Card>;
                        });
                    }}

                />
                {children}
                <footer/>
            </Frame>
        </InstantSearch>
    );
}
