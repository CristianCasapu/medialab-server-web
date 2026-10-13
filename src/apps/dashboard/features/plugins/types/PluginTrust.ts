/** medialab Server: signature state of an installed plugin version. */
export type PluginTrustState = 'Verified' | 'Unsigned' | 'Modified';

export interface PluginTrustInfo {
    Id: string
    Version: string
    Name: string
    Trust: PluginTrustState
}

/** The medialab plugin catalog (public manifest; licensed users may add it with ?key=). */
export const MEDIALAB_CATALOG_PREFIX = 'https://medialab.works/';
