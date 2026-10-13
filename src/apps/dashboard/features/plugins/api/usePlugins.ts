import type { Api } from '@jellyfin/sdk';
import { getPluginApi } from '@jellyfin/sdk/lib/utils/api/plugin-api';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { useApi } from 'hooks/useApi';

import { getArrayResponseData, selectArray } from './arrayResponse';
import { QueryKey } from './queryKey';

const fetchPlugins = async (
    api: Api,
    options?: AxiosRequestConfig
) => {
    const response = await getPluginApi(api).getPlugins(options);
    return getArrayResponseData(response.data, 'Plugins');
};

export const getPluginsQuery = (
    api?: Api
) => queryOptions({
    queryKey: [ QueryKey.Plugins ],
    queryFn: ({ signal }) => fetchPlugins(api!, { signal }),
    select: selectArray,
    enabled: !!api
});

export const usePlugins = () => {
    const { api } = useApi();
    return useQuery(getPluginsQuery(api));
};
