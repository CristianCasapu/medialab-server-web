import { describe, expect, it } from 'vitest';

import { isUserMenuUrl, toMenuLinks } from './medialabUserMenu';

describe('isUserMenuUrl', () => {
    it('accepts same-server paths and web routes', () => {
        for (const good of ['/Headend/Tv', 'Headend/Tv/', '#/configurationpage?name=headend', '/Registration/Account?tab=plan']) {
            expect(isUserMenuUrl(good)).toBe(true);
        }
    });

    it('rejects other servers, traversal and scripts', () => {
        for (const bad of ['https://evil.example/x', '//evil.example/x', '/a/../b', 'java' + 'script:alert(1)', '/a?x=<b>', '', 42, null]) {
            expect(isUserMenuUrl(bad)).toBe(false);
        }
    });
});

describe('toMenuLinks', () => {
    it('makes server paths absolute and drops invalid entries', () => {
        const links = toMenuLinks([
            { Name: 'TV', Url: '/Headend/Tv', Icon: 'live_tv' },
            { Name: 'Page', Url: '#/configurationpage?name=x', Icon: 'BAD ICON' },
            { Name: 'Evil', Url: 'https://evil.example' },
            { Name: ' ', Url: '/x' },
            null
        ], 'https://media.example/jf/');
        expect(links).toEqual([
            { name: 'TV', url: 'https://media.example/jf/Headend/Tv', icon: 'live_tv', sameTab: true },
            { name: 'Page', url: '#/configurationpage?name=x', icon: 'extension', sameTab: true }
        ]);
        expect(toMenuLinks({}, 'x')).toEqual([]);
    });
});
