<script>
	import { goto } from '$app/navigation';
	import { loggedInAs } from '$lib/loggedInAs';

	let username = '';
	let password = '';

	async function submitForm() {
		const result = await fetch('/api/login', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				password
			})
		});
		if (result.status === 200) {
			$loggedInAs = {
				username,
				loggedInAt: new Date()
			};
			goto('/');
		}
	}

	async function checkUsername() {}
</script>

<div>
	<h1>Login</h1>
	<form on:submit|preventDefault={submitForm} action="/api/login" method="PUT">
		<label
			>Username
			<input
				bind:value={username}
				on:change={checkUsername}
				type="text"
				autocomplete="username"
				required
			/>
		</label>
		<label
			>Password
			<input bind:value={password} type="password" autocomplete="current-password" required />
		</label>
		<input type="submit" />
	</form>
</div>
