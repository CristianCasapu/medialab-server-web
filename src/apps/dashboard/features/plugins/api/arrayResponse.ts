/**
 * Returns the data of a response that should hold a JSON array, or throws if it does not.
 * A 2xx response with an empty or non-JSON body (e.g. cut short by a reverse proxy) is handed back by axios as a
 * string; throwing makes the query fail and retry instead of caching (and persisting) that string as data.
 */
export const getArrayResponseData = <T>(data: T[], endpoint: string): T[] => {
    if (!Array.isArray(data)) {
        throw new TypeError(`Invalid response from ${endpoint}: expected an array`);
    }

    return data;
};

/**
 * Query `select` that never hands a non-array to the components. Covers data restored from a query cache persisted
 * before {@link getArrayResponseData} existed: restored data does not go through the query function.
 */
export const selectArray = <T>(data: T[]): T[] => (Array.isArray(data) ? data : []);
