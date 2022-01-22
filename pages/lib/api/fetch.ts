export const fetch = <Result = Record<string, any>>(
    ...params
): Promise<{ data: Result; request: XMLHttpRequest; remaining: number }> => {
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=2inlkIQc3RHHUNhGasEUMs8kQ8Z3nebl7LcdhmQg&${params.join('&')}`

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.onload = function () {
            resolve({
                request: this,
                data: JSON.parse(this.responseText),
                remaining: parseInt(this.getResponseHeader('x-ratelimit-remaining'))
            });
        };
        request.onerror = function (ev) {
            reject({request: this, event: ev});
        };
        request.open("GET", apiUrl, true);
        request.send();
    });
}
