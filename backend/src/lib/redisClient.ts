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

export { getClient, init };
