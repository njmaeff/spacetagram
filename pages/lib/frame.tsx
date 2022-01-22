import React, {useRef, useState} from "react";
import {useThemeApi} from "./hooks/useThemeApi";
import {NavBar} from "./navigation";
import {
    Button,
    DisplayText,
    Frame as ShopifyFrame,
    Icon,
    TopBar
} from "@shopify/polaris";
import {CirclePlusMinor, ColorsMajor} from "@shopify/polaris-icons";
import {UsePictureOfTheDayStorage} from "./hooks/usePictureOfTheDayStorage";
import Link from "next/link";

export const Frame: React.FC<{ savedSearches: UsePictureOfTheDayStorage; searchProps? }> = ({
                                                                                                children,
                                                                                                savedSearches,
                                                                                                searchProps = {}
                                                                                            }) => {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const {toggleTheme} = useThemeApi()
    const skipToContentRef = useRef(null);
    return <ShopifyFrame
        showMobileNavigation={isNavMenuOpen}
        onNavigationDismiss={() => setIsNavMenuOpen(current => !current)}
        navigation={
            <NavBar savedSearches={savedSearches}/>
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
                    {...searchProps}

                    onNavigationToggle={() => setIsNavMenuOpen(current => !current)}
                />
            </header>
        }>
        <a id="SkipToContentTarget"
           ref={skipToContentRef}
           tabIndex={-1}/>
        {children}
    </ShopifyFrame>
}
