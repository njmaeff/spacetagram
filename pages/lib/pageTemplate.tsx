import Head from "next/head";
import React from "react";

export interface PageProps {
    title: string;
    charSet?: string;
}

export const PageTemplate: React.FC<PageProps> = ({
                                                      children,
                                                      title,
                                                  }) => {


    return (<>
            <Head>
                <title>{title}</title>
            </Head>
            {children}
        </>
    );
};
