import { getClient } from './redisClient';

// TODO this function seems pretty convoluted
// if there's a better way to atomically update
// the connections I'll do that instead
//
// Example of where this could go wrong:
// A very popular user has a lot of connection
// permissions given, locking the user out of
// connecting to other users.
//
// Possible solutions:
// 1. Lexicographically sort and concatenate
// the two users connecting and then check
// if the resulting string is a member of
// the set of all possible connections?
//
// 2. Intersect the two sets of permissions?
// This would be a lot easier to implement lol
//
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
