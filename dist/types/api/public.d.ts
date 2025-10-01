import type { PublicApiClientConfig, StreamCallbacks, StreamResult } from "../ui/types";
export declare class PublicApiClient {
    private cfg;
    constructor(cfg: PublicApiClientConfig);
    private headers;
    listChats(): Promise<any>;
    getChat(chatId: string): Promise<any>;
    streamQuery(params: {
        query: string;
        chat_id?: string | null;
        session_id?: string | null;
        k?: number;
    }, cb?: StreamCallbacks): Promise<StreamResult>;
}
export declare function createPublicApiClient(cfg: PublicApiClientConfig): PublicApiClient;
