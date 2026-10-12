/**
 * medialab Server: scripts added to the web client by server plugins (capability "plugin-web-scripts").
 * The server lists same-server .js paths (GET /MedialabEdition/WebScripts); each one is loaded once, after start-up.
 * On official Jellyfin the endpoint does not exist and nothing happens.
 */
const SCRIPT_PATH = /^\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_.-]+)*\.js$/;

export function isWebScriptPath(path: unknown): path is string {
    return typeof path === 'string' && path.length <= 256 && !path.includes('..') && !path.startsWith('//') && SCRIPT_PATH.test(path);
}

export async function loadServerWebScripts(serverUrl?: string): Promise<void> {
    if (!serverUrl) return;
    let base = serverUrl;
    while (base.endsWith('/')) base = base.slice(0, -1);
    let list: unknown;
    try {
        const response = await fetch(`${base}/MedialabEdition/WebScripts`, { credentials: 'same-origin' });
        if (!response.ok) return;
        list = await response.json();
    } catch {
        return;
    }

    if (!Array.isArray(list)) return;
    for (const path of list.filter(isWebScriptPath)) {
        const src = base + path;
        if (document.querySelector(`script[data-medialab-web-script="${path}"]`)) continue;
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.dataset.medialabWebScript = path;
        document.head.appendChild(script);
    }
}
