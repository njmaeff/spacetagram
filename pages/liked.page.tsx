import React from "react";
import {Page} from "./lib/page";
import {
    PictureOfTheDayData,
    UsePictureOfTheDay
} from "./lib/db/usePictureOfTheDay";
import {WithSearch} from "./lib/withSearch";
import {
    Button,
    Card,
    DisplayText,
    Loading,
    TextContainer,
    TextStyle
} from "@shopify/polaris";
import {Highlight, Hits} from "./lib/search/instantSearch";
import {CircleMinusMajor, HeartMajor} from "@shopify/polaris-icons";
import {UseSearchClient} from "./hooks/useSearchClient";

export default () => {
    const savedSearches = new UsePictureOfTheDay('spacetagramData');
    const client = new UseSearchClient(savedSearches)
    client.fetchSavedData();

    return (
        <Page title={"Spacetagram | Liked"}>
            <WithSearch searchClient={client.data.client}
                        likesCount={savedSearches.count}
            >{
                client.data.loading ? <Loading/> :
                    <>
                        <div className={'spacetagram-date-control'}>
                            <Button
                                onClick={() => client.fetchRandom()}>Random</Button>
                            <DisplayText element={'p'}>Remaining
                                Queries: {client.data.remaining}</DisplayText>
                        </div>
                        <Hits
                            HitsComponent={({hits}: { hits: PictureOfTheDayData[] }) => {
                                return hits.map((hit) => {

                                    const MediaComponent = hit.media_type === 'image' ? (
                                        <figure>
                                            <a href={hit.url}
                                               rel="noopener noreferrer"
                                               target="_blank">
                                                <img
                                                    src={hit.url}
                                                    alt={hit.title}
                                                />
                                            </a>
                                            {hit.copyright && <figcaption>
                                                <TextStyle
                                                    variation="subdued"><strong
                                                    aria-label={'Copyright'}>{'\u24B8 '}</strong>
                                                    {hit.copyright}
                                                </TextStyle>
                                            </figcaption>}
                                        </figure>) : (
                                        <iframe width="420" height="315"
                                                src={hit.url}>
                                        </iframe>
                                    );

                                    const isSaved = savedSearches.hasKey(hit.hitKey)
                                    return <Card
                                        key={hit.hitKey}
                                        title={<div>
                                            <DisplayText
                                                element={'h2'}><Highlight
                                                hit={hit}
                                                attribute={'title'}/>
                                            </DisplayText>
                                            <DisplayText
                                                size="small"
                                                element={'h3'}>{hit.date.toDateString()}</DisplayText>
                                        </div>} actions={[]}
                                        primaryFooterAction={{
                                            icon: isSaved ? CircleMinusMajor : HeartMajor,
                                            onAction() {
                                                isSaved
                                                    ? savedSearches.removeItem(hit.hitKey) :
                                                    savedSearches.addItem(hit.hitKey, hit);
                                            }
                                        }
                                        }
                                        sectioned={true}
                                        footerActionAlignment={'right'}>
                                        <TextContainer spacing={"loose"}>

                                            {MediaComponent}
                                            <DisplayText
                                                size="small"
                                                element={'p'}><Highlight
                                                hit={hit}
                                                attribute={'explanation'}/></DisplayText>
                                        </TextContainer>
                                    </Card>;
                                });
                            }}

                        /></>
            }</WithSearch>

        </Page>
    );
};
