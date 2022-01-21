import Fuse from "fuse.js";
import {PictureOfTheDayData} from "../../db/pictureOfTheDay";
import {SearchResult} from "./types";

export class LocalStorageIndex {

}

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
                    hits = this.client.search(params.query).map((hit) => hit.item)
                } else {
                    hits = this.data;
                }

                const pageStart = params.page * 10

                return {
                    ...params,
                    hits: hits.slice(pageStart, pageStart + 10).map((hit) => ({
                        ...hit,
                        date: new Date(hit.date)
                    })),
                    nbHits: hits.length,
                    nbPages: Math.ceil(hits.length / params.hitsPerPage),
                };
            })
        }
    }

    private makeClient() {
        this.client = new Fuse<any>(this.data, {
            keys: this.options.keys,
            includeScore: true,
        })
    }

    constructor(private data: any[], private options: Options) {
        this.makeClient();
    }

    private client: Fuse<PictureOfTheDayData & { date: string }>
}


export interface Options {
    keys: string[]
}
