/**
 * medialab Server: links that server plugins add to the user menu (capability "plugin-user-menu").
 * The server lists them for the signed-in user (GET /MedialabEdition/UserMenu); they are shown next to the web config
 * menuLinks and open in the same tab. On official Jellyfin the endpoint does not exist and the list is empty.
 */
import type { ApiClient } from 'jellyfin-apiclient';

import type { MenuLink } from '../types/webConfig';

const LINK_URL = /^(#\/|\/)?[A-Za-z0-9_-]+(\/[A-Za-z0-9_.-]+)*\/?(\?[A-Za-z0-9_.=&%-]*)?$/;
const ICON = /^[a-z0-9_]{1,40}$/;

export function isUserMenuUrl(url: unknown): url is string {
    return typeof url === 'string' && url.length > 0 && url.length <= 256 && !url.includes('..') && !url.startsWith('//') && LINK_URL.test(url);
}

/** Server entries ({ Name, Url, Icon }) to menu links; server paths become absolute, web routes stay as they are. */
export function toMenuLinks(list: unknown, serverAddress: string): MenuLink[] {
    if (!Array.isArray(list)) return [];
    let base = serverAddress;
    while (base.endsWith('/')) base = base.slice(0, -1);
    return list.flatMap(entry => {
        const { Name: name, Url: url, Icon: icon } = (entry || {}) as Record<string, unknown>;
        if (typeof name !== 'string' || !name.trim() || !isUserMenuUrl(url)) return [];
        let href = url;
        if (!url.startsWith('#')) href = base + (url.startsWith('/') ? url : '/' + url);
        return [{ name: name.trim(), url: href, icon: typeof icon === 'string' && ICON.test(icon) ? icon : 'extension', sameTab: true }];
    });
}

export async function getServerMenuLinks(apiClient?: ApiClient): Promise<MenuLink[]> {
    if (!apiClient?.accessToken()) return [];
    try {
        const list: unknown = await apiClient.getJSON(apiClient.getUrl('MedialabEdition/UserMenu'));
        return toMenuLinks(list, apiClient.serverAddress());
    } catch {
        return [];
    }
}
