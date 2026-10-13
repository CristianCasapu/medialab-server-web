import type { Api } from '@jellyfin/sdk';
import type { PluginApiGetConfigurationPagesRequest } from '@jellyfin/sdk/lib/generated-client/api/plugin-api';
import { getPluginApi } from '@jellyfin/sdk/lib/utils/api/plugin-api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { useApi } from 'hooks/useApi';

import { getArrayResponseData, selectArray } from './arrayResponse';
import { QueryKey } from './queryKey';

const fetchConfigurationPages = async (
    api: Api,
    params?: PluginApiGetConfigurationPagesRequest,
    options?: AxiosRequestConfig
) => {
    const response = await getPluginApi(api)
        .getConfigurationPages(params, options);
    return getArrayResponseData(response.data, 'web/ConfigurationPages');
};

export const getConfigurationPagesQuery = (
    api?: Api,
    params?: PluginApiGetConfigurationPagesRequest
) => queryOptions({
    queryKey: [ QueryKey.ConfigurationPages, params?.enableInMainMenu ],
    queryFn: ({ signal }) => fetchConfigurationPages(api!, params, { signal }),
    select: selectArray,
    enabled: !!api
});

export const useConfigurationPages = (
    params?: PluginApiGetConfigurationPagesRequest
) => {
    const { api } = useApi();
    return useQuery(getConfigurationPagesQuery(api, params));
};
