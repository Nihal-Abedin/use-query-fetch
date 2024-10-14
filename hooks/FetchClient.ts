import { FetchConfigType } from "../utils/fetchConfig";

export class FetchClient {
    defaultOptions: FetchConfigType
    constructor(config: FetchConfigType) {
        this.defaultOptions = { ...config }
    }
}