import Head from "next/head";
import React from "react";

export interface PageProps {
    title: string;
    charSet?: string;
}

export const PageTemplate: React.FC<PageProps> = ({
                                                      children,
                                                      title,
                                                      charSet = "UTF-8",
                                                  }) => {


    return (<>
            <Head>
                <title>{title}</title>
                <meta charSet={charSet}/>
                <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
                <link rel="apple-touch-icon" sizes="180x180"
                      href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32"
                      href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16"
                      href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
            </Head>
            {children}
        </>
    );
};
