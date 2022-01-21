import React, {useEffect, useRef} from 'react';
import {InfiniteHitsProvided} from "react-instantsearch-core";

export const InfiniteHits: React.ComponentType<InfiniteHitsProvided & { HitsComponent }> = ({
                                                                                                hasMore,
                                                                                                refineNext,
                                                                                                hits,
                                                                                                HitsComponent
                                                                                            }) => {

    const sentinel = useRef(null);
    const onSentinelIntersection = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && hasMore) {
                refineNext();
            }
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(onSentinelIntersection);
        observer.observe(sentinel.current);
        return () => observer.disconnect()
    })

    return (
        <div>
            <HitsComponent hits={hits}/>
            <li
                className="ais-InfiniteHits-sentinel"
                ref={sentinel}
            />
        </div>
    );
}
