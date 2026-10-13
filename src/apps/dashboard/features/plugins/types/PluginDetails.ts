import type { ConfigurationPageInfo, PluginStatus, VersionInfo } from '@jellyfin/sdk/lib/generated-client';

import type { PluginTrustState } from './PluginTrust';

export interface PluginDetails {
    canUninstall: boolean
    category?: string
    description?: string
    id: string
    imageUrl?: string
    isEnabled: boolean
    /** medialab Server: from the medialab catalog or signed by medialab */
    isMedialab?: boolean
    name?: string
    owner?: string
    configurationPage?: ConfigurationPageInfo
    status?: PluginStatus
    /** medialab Server: signature state of the installed version */
    trust?: PluginTrustState
    version?: VersionInfo
    versions: VersionInfo[]
}
