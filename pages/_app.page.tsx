import React, {useEffect, useState} from 'react';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import {
    ThemeConfig
} from "@shopify/polaris/build/ts/latest/src/utilities/theme";
import {ThemeApi} from './lib/hooks/useThemeApi';
import "./lib/styles.scss"
import {UseClientOptionsStorage} from "./lib/hooks/useClientOptionsStorage";

export const App = ({Component, pageProps}) => {

    const options = new UseClientOptionsStorage();
    const [colorScheme, updateScheme] = useState<'dark' | 'light'>("light");
    const savedScheme = options.get('colorScheme')

    useEffect(() => {
        if (!savedScheme) {
            options.set('colorScheme', 'light');
        } else if (savedScheme === 'dark') {
            // this will trigger a rerender. For some reason dark doesn't load
            // properly without useEffect
            updateScheme('dark')
        }
    }, []);

    const theme: ThemeConfig = {
        colors: {
            primary: '#506AD4'
        },
        colorScheme,
        logo: {
            width: 124,
            topBarSource: colorScheme === 'dark' ? '/img/logo-dark.png' : '/img/logo-light.png',
            url: 'http://github.com/njmaeff/spacetagram',
            accessibilityLabel: 'Spacetagram',
        },
    };

    return (
        <AppProvider
            i18n={enTranslations}
            theme={theme}
        >
            <ThemeApi.Provider value={{
                toggleTheme: () => {
                    if (colorScheme === 'light') {
                        options.set('colorScheme', 'dark');
                        updateScheme('dark');
                    } else {
                        options.set('colorScheme', 'light')
                        updateScheme('light')
                    }
                }
            }}>
                <Component {...pageProps} />
            </ThemeApi.Provider>
        </AppProvider>
    );
}
export default App
