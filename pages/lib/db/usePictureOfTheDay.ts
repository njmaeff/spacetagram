import {UseLocalStorageDB} from "./localStorage";

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
    isSaved: boolean,
}


export class UsePictureOfTheDay extends UseLocalStorageDB<PictureOfTheDayData> {
}
