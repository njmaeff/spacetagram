import {
    connectHighlight,
    connectInfiniteHits,
    connectSearchBox,
} from "react-instantsearch-dom"
import React from "react";
import {InfiniteHits} from "./infiniteHits";
import {TopBar} from "@shopify/polaris";

export const Highlight = connectHighlight(({highlight, hit, attribute}) => {
    const parsedHit = highlight({
        highlightProperty: '_highlightResult',
        attribute,
        hit,
    });
    if (parsedHit.length === 0) {
        return <>{hit[attribute]}</>;
    } else {
        return <>{
            parsedHit.map(
                (hit) => hit.isHighlighted ?
                    <em className="spacetagram-highlight">{hit.value}</em> : hit.value
            )
        }</>;
    }

});

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
            placeholder="Search Results"
            showFocusBorder
        />
        {children}
    </div>

));

export const Hits = connectInfiniteHits(InfiniteHits) as React.ComponentClass<{ HitsComponent }, any>
