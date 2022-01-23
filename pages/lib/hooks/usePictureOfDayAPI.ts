import {useState} from "react";
import {PictureOfTheDayData} from "./usePictureOfTheDayStorage";

type Data = { loading: boolean; result; remaining? };

export class UsePictureOfDayAPI {
    async fetchRandom() {
        this.mergeData({loading: true})
        const result = await fetch<PictureOfTheDayData[]>(`count=1`);
        this.mergeData({
            result: result.data,
            loading: false,
            remaining: result.remaining
        })

    }

    async fetchToday() {
        this.mergeData({loading: true})
        const result = await fetch<PictureOfTheDayData[]>();
        this.mergeData({
            result: result.data,
            loading: false,
            remaining: result.remaining
        })

    }


    constructor() {
        const [data, updateData] = useState({
            loading: true,
            result: [],
        })

        this.data = data
        this.mergeData = (data) => updateData(prev => ({...prev, ...data}))
    }

    readonly data: Data
    private readonly mergeData: (data: Partial<Data>) => void


}

export const fetch = <Result = Record<string, any>>(
    ...params
): Promise<{ data: Result; request: XMLHttpRequest; remaining: number }> => {
    let apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=2inlkIQc3RHHUNhGasEUMs8kQ8Z3nebl7LcdhmQg'
    if (params.length > 0) {
        apiUrl = `${apiUrl}&${params.join('&')}`
    }

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.onload = function () {
            const result = JSON.parse(this.responseText)
            let normalizedData
            if (Array.isArray(result)) {
                normalizedData = normalizeApiResponse(result);
            } else {
                normalizedData = normalizeApiResponse([result])
            }

            resolve({
                request: this,
                data: normalizedData,
                remaining: parseInt(this.getResponseHeader('x-ratelimit-remaining'))
            });
        };
        request.onerror = function (ev) {
            reject({request: this, event: ev});
        };

        request.open("GET", apiUrl, true);
        request.setRequestHeader(
            'SameSite', 'Lax'
        )
        request.send();
    });
}

export const normalizeApiResponse = (response) => {
    return response.map((element) => {
        const date = new Date(element.date)
        const elementKey = date.getTime()

        return {
            ...element,
            date,
            hitKey: elementKey,
        }
    });
};
