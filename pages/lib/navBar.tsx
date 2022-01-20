import {ActionList, Button, Frame, Navigation, TopBar} from "@shopify/polaris";
import {ColorsMajor, HomeMajor, SaveMinor,} from "@shopify/polaris-icons";
import {useState} from "react";
import {useThemeApi} from "../hooks/useThemeApi";
import {useRouter} from "next/router";

export const Header = () => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const {toggleTheme} = useThemeApi()
    const router = useRouter();

    return (
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
                <TopBar
                    secondaryMenu={
                        <div style={{
                            margin: '0 1rem',
                        }}>
                            <Button onClick={toggleTheme} icon={ColorsMajor}
                                    accessibilityLabel={'Toggle dark and light theme'}/>
                        </div>
                    }
                    showNavigationToggle
                    searchResultsVisible={isSearchActive}
                    searchField={<TopBar.SearchField
                        onChange={() => {
                        }}
                        value={searchValue}
                        placeholder="Search"
                        showFocusBorder
                    />
                    }
                    searchResults={<ActionList
                        items={[{content: 'Shopify help center'}, {content: 'Community forums'}]}
                    />}
                    onSearchResultsDismiss={() => ({})}
                    onNavigationToggle={() => setIsNavMenuOpen(current => !current)}
                />}>

        </Frame>
    );
}
