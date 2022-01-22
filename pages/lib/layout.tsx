import {Button, Frame, Navigation, Select, TopBar} from "@shopify/polaris";
import {ColorsMajor, HeartMajor, HomeMajor,} from "@shopify/polaris-icons";
import React, {useRef, useState} from "react";
import {useThemeApi} from "../hooks/useThemeApi";
import {useRouter} from "next/router";
import {SearchBox} from "./search/instantSearch";
import {Configure, InstantSearch} from "react-instantsearch-dom";
import {eachYearOfInterval, formatISO, subYears} from "date-fns"

export const getISODate = (date: Date): string => formatISO(date, {representation: 'date'})

export const dateInterval = eachYearOfInterval({
    start: new Date(2000, 1, 0),
    end: new Date()
}).reverse().map((date) => {
    return {
        label: `${date.getFullYear()}`,
        value: `${getISODate(date)}`
    }
})
dateInterval.unshift({label: '', value: 'none'})

export const useDateControl = () => {
    const [dateRange, updateDateRange] = useState<[string, string] | null>()

    return {
        dateRange,
        updateDateRange
    } as const

};

export const DateControl: React.FC<ReturnType<typeof useDateControl>> = ({updateDateRange}) => {
    const [selection, updateSelection] = useState("none")

    return <Select
        label="By Year"
        labelInline={true}
        options={dateInterval}
        onChange={(value) => {
            updateSelection(value)
            if (value === 'none') {
                updateDateRange(null)
            } else {
                const end = new Date(value);
                updateDateRange([
                    getISODate(end),
                    getISODate(subYears(end, 1))
                ]);

            }
        }}
        value={selection}
    />
};

export const Layout: React.FC<{ likesCount, searchClient, }> = ({
                                                                    children,
                                                                    searchClient,
                                                                    likesCount
                                                                }) => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const {toggleTheme} = useThemeApi()
    const router = useRouter();
    const skipToContentRef = useRef(null);

    return (
        <InstantSearch
            searchClient={searchClient}
            indexName={''}
        >

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
                                    badge: likesCount,
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
                <a id="SkipToContentTarget" ref={skipToContentRef}
                   tabIndex={-1}/>
                {children}
                <footer/>
            </Frame>
        </InstantSearch>
    );
}
