import Fuse from "fuse.js";

export class LocalStorageIndex {

}

export class MemoryInstantSearchAdapter {
    clearCache() {
        this.makeClient();
        return this;
    }

    search(instantSearchRequests) {
        instantSearchRequests.forEach((request) => {
            const filters = request.params.facetFilters ?? []
            filters.push(...this.options.facetFilters)
            request.params.facetFilters = filters
        });

        debugger
    }

    searchForFacetValues(instantSearchRequests) {
        debugger
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

    private client: Fuse<any>
}


export interface Options {
    facetFilters?: string[],
    keys: string[]
}
