#!/usr/bin/env node

const { program } = require("commander");
const { dexscreener, fetchPair, fetchPrice } = require("../lib/index.js");

async function execute() {
    const command = this.name();
    let response;
    switch (command) {
        case "fetchPair":
            response = await fetchPair(...this.args);
            break;
        case "fetchPrice":
            response = await fetchPrice(...this.args);
            break;
        default:
            response = await dexscreener[command](...this.args);
            break;
    }
    console.log(JSON.stringify(response, undefined, 2));
}

async function main() {
    program
        .command("pairs")
        .arguments("<chainId> <pairAddresses...>")
        .action(execute);

    program
        .command("tokens")
        .arguments("<tokenAddreses>")
        .action(execute);

    program
        .command("search")
        .arguments("<query>")
        .action(execute);

    program
        .command("fetchPrice")
        .arguments("<chainId> <dexId> <symbolOrPairAddress>")
        .action(execute);

    program
        .command("fetchPair")
        .arguments("<chainId> <dexId> <pairSymbolOrPairAddress>")
        .action(execute);

    program
        .command("fetchPrice")
        .arguments("<chainId> <dexId> <pairSymbol> [inUSD]")
        .action(execute);

    await program.parseAsync();
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
