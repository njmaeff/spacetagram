import React, {useEffect} from "react";
import {PageTemplate} from "./lib/pageTemplate";
import {
    PictureOfTheDayData,
    UsePictureOfTheDayStorage
} from "./lib/hooks/usePictureOfTheDayStorage";
import {WithSearchContext} from "./lib/context/withSearchContext";
import {Loading} from "@shopify/polaris";
import {Hits, SearchBox} from "./lib/search/instantSearch";
import {UseSearchClient} from "./lib/hooks/useSearchClient";
import {Card} from "./lib/card";
import {Frame} from "./lib/frame";

export default () => {
    const savedSearches = new UsePictureOfTheDayStorage();
    const client = new UseSearchClient(savedSearches)
    useEffect(() => {
        client.fetchSavedData();
    }, [savedSearches.count]);

    return (
        <PageTemplate title={"Spacetagram | Liked"}>
            <WithSearchContext searchClient={client.data.client}
                               Frame={({children}) => <Frame searchProps={{
                                   searchResultsVisible: false,
                                   searchField: <SearchBox/>
                               }}
                                                             savedSearches={savedSearches}
                               >{children}</Frame>
                               }

            >{
                client.data.loading ? <Loading/> : <Hits
                    HitsComponent={({hits}: { hits: PictureOfTheDayData[] }) => {
                        return hits.map((hit) => <Card data={hit}
                                                       key={hit.hitKey}
                                                       savedSearches={savedSearches}
                                                       highlighted/>
                        );
                    }}

                />
            }</WithSearchContext>

        </PageTemplate>
    );
};
