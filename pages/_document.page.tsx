import {Head, Html, Main, NextScript} from 'next/document'
import React from "react";

export default () => {

    return (
        <Html>
            <Head>
                <meta charSet={"UTF-8"}/>
                <link rel="apple-touch-icon" sizes="180x180"
                      href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32"
                      href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16"
                      href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
};
