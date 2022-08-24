import { getClient, init, quit } from "./redisClient";

beforeAll(async () => {
    return await init();
})

afterAll(async () => {
    return await quit();
})

test('can get redis client', () => {
    return expect(getClient()).toBeDefined();
})

test('can set and get key', async () => {
    const client = getClient();
    await client.set('key', 'value');
    const value = await client.get('key');
    expect(value).toBe('value');
})
