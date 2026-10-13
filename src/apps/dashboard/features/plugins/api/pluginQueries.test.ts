import type { Api } from '@jellyfin/sdk';
import { QueryClient, QueryObserver, hydrate, type QueryKey, type QueryObserverOptions } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getConfigurationPagesQuery } from './useConfigurationPages';
import { getPackagesQuery } from './usePackages';
import { getPluginsQuery } from './usePlugins';

// What axios resolves with for a 2xx response whose body is empty (or not JSON).
const EMPTY_BODY_RESPONSE = { data: '' };

vi.mock('@jellyfin/sdk/lib/utils/api/plugin-api', () => ({
    getPluginApi: () => ({
        getConfigurationPages: () => Promise.resolve(EMPTY_BODY_RESPONSE),
        getPackages: () => Promise.resolve(EMPTY_BODY_RESPONSE),
        getPlugins: () => Promise.resolve(EMPTY_BODY_RESPONSE)
    })
}));

// The hooks module pulls in the whole legacy app through useApi; the query options do not need it.
vi.mock('hooks/useApi', () => ({ useApi: () => ({}) }));

const api = {} as Api;

type ArrayQueryOptions = QueryObserverOptions<unknown[], Error, unknown[], unknown[], QueryKey>;

const queries: [ string, ArrayQueryOptions ][] = [
    [ 'configuration pages', getConfigurationPagesQuery(api, { enableInMainMenu: true }) as unknown as ArrayQueryOptions ],
    [ 'packages', getPackagesQuery(api) as unknown as ArrayQueryOptions ],
    [ 'plugins', getPluginsQuery(api) as unknown as ArrayQueryOptions ]
];

const createQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false }
    }
});

describe('plugin queries', () => {
    let queryClient: QueryClient | undefined;

    afterEach(() => {
        queryClient?.clear();
    });

    it.each(queries)('do not cache an empty response body as %s', async (_, options) => {
        queryClient = createQueryClient();

        await expect(queryClient.fetchQuery(options)).rejects.toThrow(TypeError);
        expect(queryClient.getQueryData(options.queryKey)).toBeUndefined();
    });

    it.each(queries)('give components an array for %s restored from a poisoned cache', (_, options) => {
        queryClient = createQueryClient();
        // A query cache persisted by an earlier version, holding the empty string as data.
        hydrate(queryClient, {
            mutations: [],
            queries: [{
                queryKey: options.queryKey,
                queryHash: JSON.stringify(options.queryKey),
                state: {
                    data: '',
                    dataUpdateCount: 1,
                    dataUpdatedAt: Date.now(),
                    error: null,
                    errorUpdateCount: 0,
                    errorUpdatedAt: 0,
                    fetchFailureCount: 0,
                    fetchFailureReason: null,
                    fetchMeta: null,
                    isInvalidated: false,
                    status: 'success',
                    fetchStatus: 'idle'
                }
            }]
        });

        const observer = new QueryObserver(queryClient, { ...options, enabled: false });

        expect(observer.getCurrentResult().data).toEqual([]);
    });
});
