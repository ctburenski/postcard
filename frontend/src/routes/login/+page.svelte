<script>
	import { goto } from '$app/navigation';
	import { loggedInAs } from '$lib/loggedInAs';

	let username = '';
	let password = '';

	async function submitForm() {
		const result = await fetch('/api/auth/login', {
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

	// TODO this can match the logic in the register page
	// async function checkUsername() {}
</script>

{#if $loggedInAs}
	<h1>Hi {$loggedInAs.username}, you're logged in</h1>
{:else}
	<div>
		<h1>Login</h1>
		<form on:submit|preventDefault={submitForm} action="/api/auth/login" method="PUT">
			<label
				>Username
				<input bind:value={username} type="text" autocomplete="username" required />
			</label>
			<label
				>Password
				<input bind:value={password} type="password" autocomplete="current-password" required />
			</label>
			<input type="submit" />
		</form>
	</div>
{/if}
