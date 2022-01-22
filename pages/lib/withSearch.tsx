import {Frame} from "@shopify/polaris";
import React from "react";
import {Configure, InstantSearch} from "react-instantsearch-dom";

export const WithSearch: React.FC<{ searchClient, Frame }> = ({
                                                                  children,
                                                                  searchClient,
                                                                  Frame,
                                                              }) => {
    return (
        <InstantSearch
            searchClient={searchClient}
            indexName={''}
        >

            <Configure
                hitsPerPage={10}
            />
            <Frame>{children}</Frame>
        </InstantSearch>
    );
}
