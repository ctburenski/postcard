import { getClient } from './redisClient';

async function checkConnection(
	client: ReturnType<typeof getClient>,
	username: string,
	userToRequest: string
) {
	await client.executeIsolated(async (isolatedClient) => {
		let succeded = false;
		// TODO gonna have to get rid of this variable later
		let emergencyCounter = 0;
		while (!succeded && emergencyCounter < 10) {
			await isolatedClient.watch([
				`connection-permission:${userToRequest}`,
				`connection-permission:${username}`,
				`user-connections:${userToRequest}`,
				`user-connections:${username}`
			]);
			const receivedPermission = await isolatedClient.sIsMember(
				`connection-permission:${username}`,
				userToRequest
			);
			const givenPermission = await isolatedClient.sIsMember(
				`connection-permission:${userToRequest}`,
				username
			);
			if (receivedPermission && givenPermission) {
				const result = await isolatedClient
					.multi()
					.sAdd(`user-connections:${username}`, userToRequest)
					.sAdd(`user-connections:${userToRequest}`, username)
					.exec();

				console.log(result);
				if (!result[0] === null) {
					succeded = true;
				}
				emergencyCounter++;
			} else {
				const result = await isolatedClient
					.multi()
					.sRem(`user-connections:${username}`, userToRequest)
					.sRem(`user-connections:${userToRequest}`, username)
					.exec();

				console.log(result);
				if (!result[0] === null) {
					succeded = true;
				}
				emergencyCounter++;
			}
		}
	});
}

export { checkConnection };
