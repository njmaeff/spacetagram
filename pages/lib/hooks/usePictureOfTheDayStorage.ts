import {UseLocalStorage} from "./useLocalStorage";

export interface PictureOfTheDayData {
    copyright: string;
    date: Date;
    explanation: string;
    hdurl: string;
    media_type: string;
    service_version: string;
    title: string;
    url: string;
    hitKey: number,
}


export class UsePictureOfTheDayStorage extends UseLocalStorage<PictureOfTheDayData> {

    constructor() {
        super('spacetagramData');
    }
}
