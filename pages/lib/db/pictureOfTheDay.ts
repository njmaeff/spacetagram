import {LocalStorageDB} from "./localStorage";

export interface PictureOfTheDay {
    copyright: string;
    date: Date;
    explanation: string;
    hdurl: string;
    media_type: string;
    service_version: string;
    title: string;
    url: string;
}


export class PictureOfTheDay extends LocalStorageDB<PictureOfTheDay> {
}
