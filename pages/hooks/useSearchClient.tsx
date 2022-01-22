import {
    MemoryInstantSearchAdapter
} from "../lib/search/client/memoryInstantSearchAdapter";
import {fetch} from "../lib/api/fetch";
import {PictureOfTheDayData} from "../lib/db/usePictureOfTheDay";
import {useState} from "react";

export const makeSearchClient = (savedSearches, data = []) => new MemoryInstantSearchAdapter(data, savedSearches, {
    keys: ['title', 'explanation']
});

export class UseSearchClient {
    async fetchDataRange(start: string, end: string) {
        this.updateData({loading: true,})
        const result = await fetch<PictureOfTheDayData[]>(`start_date=${start}`, `end_date=${end}`)
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

    fetchSavedData() {
        this.updateData({
            client: makeSearchClient(this.savedSearches, Array.from(this.savedSearches.values()))
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
