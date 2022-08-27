import { createClient } from 'redis';

const client = createClient({
	url: 'redis://database:6379'
});

async function init() {
	await client.connect();
}

// TODO should throw if initialize wasn't called first
function getClient() {
	return client;
}

// maybe should make it more clear this is for testing purposes?
// can't see this being used anywhere else
// might be some kind of config for ensuring it's not compiled
// outside of testing? but the testing has no influence on
// compilation? so maybe not
async function quit() {
	await client.quit();
}

export { getClient, init, quit };
