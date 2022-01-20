import React from 'react';
import App from 'next/app';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';

export default class extends App {
    render() {
        const {Component, pageProps} = this.props;
        return (
            <AppProvider
                i18n={enTranslations}
                theme={{
                    colors: {
                        surface: '#111213',
                        onSurface: '#111213',
                        interactive: '#2e72d2',
                        secondary: '#111213',
                        primary: '#3b5998',
                        critical: '#d82c0d',
                        warning: '#ffc453',
                        highlight: '#5bcdda',
                        success: '#008060',
                        decorative: '#ffc96b',
                    },
                }}
            >
                <Component {...pageProps} />
            </AppProvider>
        );
    }
}
