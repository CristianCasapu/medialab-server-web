import { useEffect, useState } from 'react';

import { useApi } from 'hooks/useApi';
import { getServerMenuLinks } from 'scripts/medialabUserMenu';
import type { MenuLink } from 'types/webConfig';

/** [ml-plugins] The user menu links registered by server plugins, for the signed-in user. */
export const useServerMenuLinks = () => {
    const { __legacyApiClient__: apiClient, user } = useApi();
    const [ links, setLinks ] = useState<MenuLink[]>([]);

    useEffect(() => {
        let active = true;
        getServerMenuLinks(user ? apiClient : undefined)
            .then(result => {
                if (active) setLinks(result);
            })
            .catch(() => {
                // getServerMenuLinks never rejects
            });
        return () => {
            active = false;
        };
    }, [ apiClient, user ]);

    return links;
};
