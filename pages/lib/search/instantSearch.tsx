import {connectInfiniteHits, connectSearchBox,} from "react-instantsearch-dom"
import React from "react";
import {InfiniteHits} from "./infiniteHits";
import {TopBar} from "@shopify/polaris";

export const SearchBox = connectSearchBox(({
                                               currentRefinement,
                                               refine,
                                               children
                                           }) => (
    <div>
        <TopBar.SearchField
            onChange={value => {
                refine(value)
            }}
            value={currentRefinement}
            placeholder="Search"
            showFocusBorder
        />
        {children}
    </div>

));

export const Hits = connectInfiniteHits(InfiniteHits) as React.ComponentClass<{ HitsComponent }, any>
