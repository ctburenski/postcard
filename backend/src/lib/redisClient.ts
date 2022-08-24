import { createClient } from "redis";

const client = createClient({
    url: 'redis://database:6379'
})

async function init() {
    await client.connect();
}

function getClient() {
    return client;
}

async function quit() {
    await client.quit();
}

export { getClient, init, quit };
