import {Utils} from "./support/utils";
import {SearchResult} from "./types";

export class SearchResponseAdapter extends Utils {
    _adaptGroupedHits(typesenseGroupedHits) {
        let adaptedResult = [];

        adaptedResult = typesenseGroupedHits.map((groupedHit) => this._adaptHits(groupedHit.hits));

        // adaptedResult is now in the form of [[{}, {}], [{}, {}], ...]
        //  where each element in the outer most array corresponds to a group.
        // We now flatten it to [{}, {}, {}]
        adaptedResult = adaptedResult.flat();

        return adaptedResult;
    }

    _adaptHits(typesenseHits) {
        let adaptedResult = [];
        adaptedResult = typesenseHits.map((typesenseHit) => {
            const adaptedHit = {
                ...typesenseHit.document,
            };
            adaptedHit.objectID = typesenseHit.document.id;
            adaptedHit._snippetResult = this._adaptHighlightResult(typesenseHit, "snippet");
            adaptedHit._highlightResult = this._adaptHighlightResult(typesenseHit, "value");

            // Add text_match score to result, if a field with that name
            // doesn't already exist
            if (!adaptedHit.text_match) {
                adaptedHit.text_match = typesenseHit.text_match;
            }

            const geoLocationValue = adaptedHit[this.configuration.geoLocationField];
            if (geoLocationValue) {
                adaptedHit._geoloc = {
                    lat: geoLocationValue[0],
                    lng: geoLocationValue[1],
                };
            }

            return adaptedHit;
        });
        return adaptedResult;
    }

    _adaptHighlightResult(typesenseHit, snippetOrValue) {
        // Algolia lists all searchable attributes in this key, even if there
        // are no matches So do the same and then override highlights

        const result = Object.assign(
            {},
            ...Object.entries(typesenseHit.document).map(([attribute, value]) => ({
                [attribute]: {
                    value: value,
                    matchLevel: "none",
                    matchedWords: [],
                },
            }))
        );

        typesenseHit.highlights.forEach((highlight) => {
            result[highlight.field] = {
                value: highlight[snippetOrValue] || highlight[`${snippetOrValue}s`],
                matchLevel: "full",
                matchedWords: highlight.matched_tokens,
            };

            if (highlight.indices) {
                result[highlight.field]["matchedIndices"] = highlight.indices;
            }
        });

        // Now convert any values that have an array value
        // Also, replace highlight tag
        Object.entries(result).forEach(([k, v]) => {
            const attribute = k;
            const {value, matchLevel, matchedWords, matchedIndices} = v;
            if (Array.isArray(value)) {
                // Algolia lists all values of the key in highlights, even
                // those that don't have any highlights So add all values of
                // the array field, including highlights
                result[attribute] = [];
                typesenseHit.document[attribute].forEach((unhighlightedValueFromArray, index) => {
                    if (matchedIndices && matchedIndices.includes(index)) {
                        result[attribute].push({
                            value: this._adaptHighlightTag(
                                `${value[matchedIndices.indexOf(index)]}`,
                                this.instantsearchRequest.params.highlightPreTag,
                                this.instantsearchRequest.params.highlightPostTag
                            ),
                            matchLevel: matchLevel,
                            matchedWords: matchedWords[index],
                        });
                    } else {
                        result[attribute].push({
                            value: `${unhighlightedValueFromArray}`,
                            matchLevel: "none",
                            matchedWords: [],
                        });
                    }
                });
            } else {
                // Convert all values to strings
                result[attribute].value = this._adaptHighlightTag(
                    `${value}`,
                    this.instantsearchRequest.params.highlightPreTag,
                    this.instantsearchRequest.params.highlightPostTag
                );
            }
        });
        return result;
    }

    _adaptFacets(typesenseFacetCounts) {
        const adaptedResult = {};
        typesenseFacetCounts.forEach((facet) => {
            Object.assign(adaptedResult, {
                [facet.field_name]: Object.assign({}, ...facet.counts.map((count) => ({[count.value]: count.count}))),
            });
        });
        return adaptedResult;
    }

    _adaptFacetStats(typesenseFacetCounts) {
        const adaptedResult = {};
        typesenseFacetCounts.forEach((facet) => {
            if (Object.keys(facet.stats).length > 0) {
                Object.assign(adaptedResult, {
                    [facet.field_name]: facet.stats,
                });
            }
        });
        return adaptedResult;
    }

    adapt() {
        const adaptedResult: SearchResult = {
            hits: this.typesenseResponse.grouped_hits
                ? this._adaptGroupedHits(this.typesenseResponse.grouped_hits)
                : this._adaptHits(this.typesenseResponse.hits),
            nbHits: this.typesenseResponse.found,
            page: this.typesenseResponse.page - 1,
            nbPages: this._adaptNumberOfPages(),
            hitsPerPage: this.typesenseResponse.request_params.per_page,
            facets: this._adaptFacets(this.typesenseResponse.facet_counts || []),
            facets_stats: this._adaptFacetStats(this.typesenseResponse.facet_counts || {}),
            query: this.typesenseResponse.request_params.q,
            processingTimeMS: this.typesenseResponse.search_time_ms,
        };

        return adaptedResult;
    }

    constructor(public typesenseResponse, public instantsearchRequest, public configuration) {
        super();
    }
}