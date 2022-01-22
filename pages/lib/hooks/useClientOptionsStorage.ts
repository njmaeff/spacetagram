import {UseLocalStorage} from "./useLocalStorage";

export class UseClientOptionsStorage extends UseLocalStorage<{}> {

    constructor() {
        super('spacetagramOptions');
    }
}
