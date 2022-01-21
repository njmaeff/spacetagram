import React, {useState} from 'react';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import {
    ThemeConfig
} from "@shopify/polaris/build/ts/latest/src/utilities/theme";
import {ThemeApi} from './hooks/useThemeApi';
import "./lib/styles.scss"

export const App = ({Component, pageProps}) => {

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const theme: ThemeConfig = {
        colors: {
            surface: '#FFFFFF',
            onsurface: '#212B36',
        },
        colorScheme: isDarkTheme ? 'dark' : 'light',
        // logo: {
        //     width: 124,
        //     topBarSource:
        //         'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
        //     url: 'http://jadedpixel.com',
        //     accessibilityLabel: 'Jaded Pixel',
        // },
    };

    return (
        <AppProvider
            i18n={enTranslations}
            theme={theme}
        >
            <ThemeApi.Provider value={{
                toggleTheme: () => isDarkTheme ? setIsDarkTheme(false) : setIsDarkTheme(true)
            }}>
                <Component {...pageProps} />
            </ThemeApi.Provider>
        </AppProvider>
    );
}
export default App
