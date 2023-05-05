const axios = require("axios");

class DEXScreener {
    constructor(config = {}) {
        this.fetcher = axios.create({
            timeout: 30000,
            ...config,
            baseURL: "https://api.dexscreener.com/latest/dex"
        });
    }

    async pairs(chainId, ...pairAddresses) {
        return await this._request(`/pairs/${chainId}/${pairAddresses.join(",")}`);
    }

    async tokens(...tokenAddreses) {
        return await this._request(`/tokens/${tokenAddreses.join(",")}`);
    }

    async search(q) {
        return await this._request("/search", { q });
    }

    async _request(endpoint, params) {
        const response = await this.fetcher.get(endpoint, { params });
        return response.data;
    }
}

const dexscreener = new DEXScreener();

async function fetchPair(chainId, dexId, pairSymbolOrPairAddress) {
    let matchedPairs;
    if (pairSymbolOrPairAddress.includes("/")) {
        const pairSymbol = pairSymbolOrPairAddress.toUpperCase();
        const result = await dexscreener.search(pairSymbol);
        matchedPairs = result.pairs.filter((pair) => {
            const base = pair.baseToken.symbol;
            const quote = pair.quoteToken.symbol;
            return pair.chainId === chainId
                && pair.dexId === dexId
                && (pairSymbol === `${base}/${quote}` || pairSymbol === `${quote}/${base}`);
        });
    } else {
        const result = await dexscreener.pairs(chainId, pairSymbolOrPairAddress);
        matchedPairs = result.pairs.filter((pair) => {
            return pair.chainId === chainId
                && pair.dexId === dexId
                && pair.pairAddress === pairSymbolOrPairAddress;
        });
    }

    if (matchedPairs.length !== 1) {
        throw new Error("Exact matched pair was not found");
    } else {
        return matchedPairs[0];
    }
}

async function fetchPrice(chainId, dexId, pairSymbol, inUSD = false) {
    const pair = await fetchPair(chainId, dexId, pairSymbol);
    const priceUsd = Number(pair.priceUsd);
    const priceNative = Number(pair.priceNative);
    const [ base ] = pairSymbol.split("/");
    if (base.toUpperCase() === pair.baseToken.symbol) {
        return inUSD ? priceUsd : priceNative;
    } else {
        return inUSD ? priceUsd/priceNative : 1/priceNative;
    }
}

module.exports = {
    DEXScreener,
    dexscreener,
    fetchPair,
    fetchPrice
}
