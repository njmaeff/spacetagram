import Fuse from "fuse.js";
import {PictureOfTheDayData} from "../../db/usePictureOfTheDay";
import {SearchResult} from "./types";
import {UseLocalStorageDB} from "../../db/localStorage";

export interface SearchRequest {
    indexName: string;
    params: Params;
}

export interface Params {
    highlightPreTag: string;
    highlightPostTag: string;
    hitsPerPage: number;
    query: string;
    page: number;
    facets: any[];
    tagFilters: string;
}


export class MemoryInstantSearchAdapter {
    async search(instantSearchRequests: SearchRequest[]): Promise<{ results: Partial<SearchResult>[] }> {

        return {
            results: instantSearchRequests.map(({params}) => {
                let hits: PictureOfTheDayData[];
                if (params.query) {
                    const hitData = this.client.search(params.query);
                    hits = hitData.map((hit) => {

                        const _highlightResult = {}
                        for (const {indices, key, value} of hit.matches) {
                            const [start, end] = largestDistance(indices)
                            _highlightResult[key] = {
                                value: value.substring(0, start) + params.highlightPreTag +
                                    value.substring(start, end + 1) +
                                    params.highlightPostTag + value.substring(end + 1),
                                matchLevel: params.query.length >= this.matchThreshold ? 'partial' : 'none',
                            }
                        }
                        return {
                            ...hit.item,
                            _highlightResult
                        };

                    });

                } else {
                    hits = this.data;
                }

                const pageStart = params.page * 10

                const resultHits = hits.slice(pageStart, pageStart + 10).map((hit) => {
                    const date = new Date(hit.date)
                    const hitKey = date.getTime()

                    return {
                        ...hit,
                        date,
                        hitKey,
                    }
                })

                return {
                    page: params.page ?? 0,
                    ...params,
                    hits: resultHits,
                    nbHits: hits.length,
                    nbPages: Math.ceil(hits.length / params.hitsPerPage),
                };
            })
        }
    }

    private makeClient() {
        this.client = new Fuse<any>(this.data, {
            keys: this.keys,
            includeMatches: true,
        })
    }

    constructor(private data: any[], private savedSearches: UseLocalStorageDB, options: Options) {
        this.keys = options.keys
        this.matchThreshold = options.matchThreshold ?? 3
        this.makeClient();
    }

    private readonly matchThreshold;
    private readonly keys: string[];
    private client: Fuse<PictureOfTheDayData & { date: string }>
}

export const largestDistance = (indices: Readonly<Fuse.RangeTuple[]>) => {
    let largestIndex;
    let largestGap;
    for (const [first, second] of indices) {
        const gap = second - first;
        if (!largestGap || gap >= largestGap) {
            largestGap = gap
            largestIndex = [first, second]
        }
    }

    return largestIndex;

};


export interface Options {
    matchThreshold?: number;
    keys: string[]
}
