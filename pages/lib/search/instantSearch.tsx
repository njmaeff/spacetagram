import {
    Configure,
    connectInfiniteHits,
    connectPoweredBy,
    connectSearchBox,
    InstantSearch,
} from "react-instantsearch-dom"
import React from "react";
import {InfiniteHits} from "./infiniteHits";
import {MemoryInstantSearchAdapter} from "./client/memoryInstantSearchAdapter";

const PoweredBy = connectPoweredBy(({url}) => <a href={'/'}>Powered by
    Local Storage</a>
);

const SearchBox = connectSearchBox(({
                                        currentRefinement,
                                        isSearchStalled,
                                        refine,
                                        children
                                    }) => (
    <form
        noValidate action="" role="search">
        <Search
            type="search"
            placeholder={'Search'}
            value={currentRefinement}
            allowClear
            onChange={event => refine(event.currentTarget.value)}
        />
        {children}
        {isSearchStalled ? 'My search is stalled' : ''}
    </form>
));

const Hits = connectInfiniteHits(InfiniteHits) as React.ComponentClass<{ HitsComponent }, any>

export const SearchInterface: React.FC<{
    indexName: string
    HitsComponent
    filters?: string[]
}> = ({
          indexName,
          HitsComponent
      }) => {
    return (
        <InstantSearch searchClient={new MemoryInstantSearchAdapter({})}
                       indexName={indexName}>
            <Configure
                hitsPerPage={10}
            />
            <div>
                <SearchBox>
                    <PoweredBy/>
                </SearchBox>
            </div>
            <Hits HitsComponent={HitsComponent}/>
        </InstantSearch>
    );
}
