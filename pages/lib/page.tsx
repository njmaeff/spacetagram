import Head from "next/head";
import React from "react";

export interface PageProps {
    title: string;
    charSet?: string;
}

export const Page: React.FC<PageProps> = ({
                                              children,
                                              title,
                                              charSet = "UTF-8",
                                          }) => {


    return (<>
            <Head>
                <title>{title}</title>
                <meta charSet={charSet}/>
                <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
            </Head>
            {children}
        </>
    );
};
