import {
    Card as ShopifyCard,
    DisplayText,
    TextContainer,
    TextStyle
} from "@shopify/polaris";
import {Highlight} from "./search/instantSearch";
import {CircleMinusMajor, HeartMajor} from "@shopify/polaris-icons";
import React from "react";
import {UsePictureOfTheDayStorage} from "./hooks/usePictureOfTheDayStorage";

export const Card: React.FC<{ data, savedSearches: UsePictureOfTheDayStorage, highlighted?: boolean }> = ({
                                                                                                              data,
                                                                                                              savedSearches,
                                                                                                              highlighted,
                                                                                                          }) => {

    const MediaComponent = data.media_type === 'image' ? (
        <figure>
            <a href={data.url}
               rel="noopener noreferrer"
               target="_blank">
                <img
                    src={data.url}
                    alt={data.title}
                />
            </a>
            {data.copyright && <figcaption>
                <TextStyle
                    variation="subdued"><strong
                    aria-label={'Copyright'}>{'\u24B8 '}</strong>
                    {data.copyright}
                </TextStyle>
            </figcaption>}
        </figure>) : (
        <iframe width="420" height="315"
                src={data.url}>
        </iframe>
    );

    const isSaved = savedSearches.hasKey(data.hitKey)
    return <ShopifyCard
        title={<div>
            <DisplayText
                element={'h2'}>
                {highlighted ? <Highlight
                    hit={data}
                    attribute={'title'}/> : data.title}

            </DisplayText>
            <DisplayText
                size="small"
                element={'h3'}>{data.date.toDateString()}</DisplayText>
        </div>} actions={[]}
        primaryFooterAction={{
            icon: isSaved ? CircleMinusMajor : HeartMajor,
            onAction() {
                isSaved
                    ? savedSearches.removeItem(data.hitKey) :
                    savedSearches.set(data.hitKey, data);
            }
        }
        }
        sectioned={true}
        footerActionAlignment={'right'}>
        <TextContainer spacing={"loose"}>

            {MediaComponent}
            <DisplayText
                size="small"
                element={'p'}>
                {highlighted ? <Highlight
                    hit={data}
                    attribute={'explanation'}/> : data.explanation
                }
            </DisplayText>
        </TextContainer>
    </ShopifyCard>;
}
