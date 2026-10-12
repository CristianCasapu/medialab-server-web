import { describe, expect, it } from 'vitest';

import { isWebScriptPath } from './medialabWebScripts';

describe('isWebScriptPath', () => {
    it('accepts same-server scripts', () => {
        expect(isWebScriptPath('/ShareLinks/Assets/menu.js')).toBe(true);
        expect(isWebScriptPath('/Registration/Assets/login.js')).toBe(true);
    });

    it('rejects other servers, traversal and non-scripts', () => {
        for (const bad of ['https://evil.example/x.js', '//evil.example/x.js', '/a/../b.js', '/a/b.css', 'a/b.js', '/a/b.js?x', 42, null]) {
            expect(isWebScriptPath(bad)).toBe(false);
        }
    });
});
