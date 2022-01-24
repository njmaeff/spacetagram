import {
    MemoryInstantSearchAdapter
} from "../search/client/memoryInstantSearchAdapter";
import {useState} from "react";

export const makeSearchClient = (savedSearches, data = []) => new MemoryInstantSearchAdapter(data, savedSearches, {
    keys: ['title', 'explanation']
});

export class UseSearchClient {

    fetchSavedData() {
        this.mergeData({
            client: makeSearchClient(this.savedSearches, Array.from(this.savedSearches.values())),
            loading: false,
        })
    }

    constructor(private savedSearches) {
        const [data, setData] = useState({
                client: makeSearchClient(savedSearches),
                loading: true,
            }
        )

        this.data = data;
        this.mergeData = (data) => setData(prev => ({
            ...prev,
            ...data,
        }));

    }

    data: {
        client: MemoryInstantSearchAdapter;
        loading: boolean;
        remaining?: number
    };
    private readonly mergeData: (data: Partial<this['data']>) => void;


}
