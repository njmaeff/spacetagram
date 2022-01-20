export interface FacetSearchResult {
    facetHits: {};
    exhaustiveFacetsCount: boolean;
    processingTimeMS: any;
}

export interface SearchResult {
    hits: any[];
    nbHits: any;
    page: number;
    nbPages: number;
    hitsPerPage: any;
    facets: {};
    facets_stats: {};
    query: any;
    processingTimeMS: any;
}
