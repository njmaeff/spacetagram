import React, {useEffect, useState} from "react";
import {Page} from "./lib/page";
import {Highlight, Hits} from "./lib/search/instantSearch";
import {
    PictureOfTheDayData,
    UsePictureOfTheDay
} from "./lib/db/usePictureOfTheDay";
import {
    Button,
    Card,
    DisplayText,
    Loading,
    TextContainer,
    TextStyle
} from "@shopify/polaris";
import {CircleMinusMajor, HeartMajor} from "@shopify/polaris-icons";
import {DateControl, Layout, useDateControl} from "./lib/layout";
import {
    MemoryInstantSearchAdapter
} from "./lib/search/client/memoryInstantSearchAdapter";
import {fetch} from "./lib/api/fetch";


export const makeSearchClient = (savedSearches, data = []) => new MemoryInstantSearchAdapter(data, savedSearches, {
    keys: ['title', 'explanation']
});


export class UseSearchClient {
    async fetchDataRange(end: string, start: string) {
        this.updateData({loading: true,})
        const result = await fetch<PictureOfTheDayData[]>(`end_date=${end}`, `start_date=${start}`)
        this.updateData({
            client: makeSearchClient(this.savedSearches, result.data),
            loading: false,
            remaining: result.remaining
        })
    }

    async fetchRandom() {
        this.updateData({loading: true})
        const result = await fetch<PictureOfTheDayData[]>(`count=1`);
        this.updateData({
            client: makeSearchClient(this.savedSearches, result.data),
            loading: false,
            remaining: result.remaining
        })

    }

    constructor(private savedSearches) {
        const [data, setData] = useState({
                client: makeSearchClient(savedSearches),
                loading: true,
            }
        )

        this.data = data;
        this.updateData = (data) => setData(prev => ({
            ...prev,
            ...data,
        }));

    }

    data: {
        client: MemoryInstantSearchAdapter;
        loading: boolean;
        remaining?: number
    };
    private readonly updateData: (data: Partial<this['data']>) => void;


}

export default () => {
    const savedSearches = new UsePictureOfTheDay('spacetagramData');
    const client = new UseSearchClient(savedSearches)
    const dateProps = useDateControl();

    useEffect(() => {
        client.fetchRandom()
    }, []);

    useEffect(() => {
        if (dateProps.dateRange ) {
            client.fetchDataRange(...dateProps.dateRange);
        }
    }, [dateProps.dateRange]);

    return (

        <Page title={"Spacetagram"}>
            <Layout searchClient={client.data.client}
                    likesCount={savedSearches.count}
            >{
                client.data.loading ? <Loading/> :
                    <>
                        <div className={'spacetagram-date-control'}>
                            <Button
                                onClick={() => client.fetchRandom()}>Random</Button>
                            <DateControl {...dateProps}/>
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
                                            icon: hit.isSaved ? CircleMinusMajor : HeartMajor,
                                            onAction() {
                                                hit.isSaved
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
            }</Layout>
        </Page>
    );
};
