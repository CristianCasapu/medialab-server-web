import type { Api } from '@jellyfin/sdk';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { useApi } from 'hooks/useApi';

import type { PluginTrustInfo } from '../types/PluginTrust';
import { QueryKey } from './queryKey';

/**
 * medialab Server: the medialab signature state of the installed plugins (GET /MedialabEdition/PluginTrust).
 * On official Jellyfin the endpoint is missing and the list is empty.
 */
const fetchPluginTrust = async (
    api: Api,
    options?: AxiosRequestConfig
): Promise<PluginTrustInfo[]> => {
    try {
        const response = await api.axiosInstance.get<PluginTrustInfo[]>(
            `${api.basePath}/MedialabEdition/PluginTrust`,
            { ...options, headers: { Authorization: api.authorizationHeader } }
        );
        return Array.isArray(response.data) ? response.data : [];
    } catch {
        return [];
    }
};

const getPluginTrustQuery = (
    api?: Api
) => queryOptions({
    queryKey: [ QueryKey.PluginTrust ],
    queryFn: ({ signal }) => fetchPluginTrust(api!, { signal }),
    enabled: !!api
});

export const usePluginTrust = () => {
    const { api } = useApi();
    return useQuery(getPluginTrustQuery(api));
};
