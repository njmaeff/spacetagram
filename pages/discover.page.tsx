import React, {useEffect} from "react";
import {PageTemplate} from "./lib/pageTemplate";
import {UsePictureOfTheDayStorage} from "./lib/hooks/usePictureOfTheDayStorage";
import {Button, DisplayText, Loading} from "@shopify/polaris";
import {UsePictureOfDayAPI} from "./lib/hooks/usePictureOfDayAPI";
import {WithDefaultContext} from "./lib/context/withDefaultContext";
import {Card} from "./lib/card";
import {Frame} from "./lib/frame";


export default () => {
    const savedSearches = new UsePictureOfTheDayStorage();
    const client = new UsePictureOfDayAPI()

    useEffect(() => {
        client.fetchToday()
    }, []);

    return (

        <PageTemplate title={"Spacetagram | Discover"}>
            <WithDefaultContext
                Frame={({children}) => <Frame
                    savedSearches={savedSearches}>{children}
                </Frame>}
            >{
                client.data.loading ? <Loading/> :
                    <>
                        <div className={'spacetagram-date-control'}>
                            <Button
                                onClick={() => client.fetchRandom()}>Random</Button>
                            <DisplayText element={'p'}>Remaining
                                Queries: {client.data.remaining}</DisplayText>
                        </div>
                        {client.data.result.map((element) => <Card
                            data={element}
                            key={element.hitKey}
                            savedSearches={savedSearches}/>
                        )}
                    </>
            }
            </WithDefaultContext>
        </PageTemplate>
    );
};
