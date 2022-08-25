<script lang="ts">
	import { goto } from '$app/navigation';
	import { loggedInAs } from '$lib/loggedInAs';

	let username = '';
	let password = '';
	let confirmPassword = '';

	async function submitForm() {
		if (password !== confirmPassword) {
			return;
		}
		const result = await fetch('/api/register', {
			method: 'POST',
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

	let validUsername: boolean | null = null;
	async function checkUsername() {
		// this is an allowable failure, since the
		// the form submission will check for this too
		//
		// no need to freak out the user
		try {
			const result = await fetch('/api/check-username', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username
				})
			});
			const data = await result.json();
			validUsername = data.valid;
		} catch (error) {
			validUsername = null;
		}
	}

	// TODO add some stuff to the form
	// to display if the username is valid or not
	// let validPassword: boolean | null = null;
	// $: {
	// }

	// TODO add some tailwind classes to the form
	// to reflect the validity of confirmed password
	let matchingPasswords: boolean | null = null;
	$: {
		password === confirmPassword ? (matchingPasswords = true) : (matchingPasswords = false);
	}
</script>

{#if $loggedInAs}
	<h1>You're already registered.</h1>
{:else}
	<div>
		<h1>Register</h1>
		<form on:submit|preventDefault={submitForm} action="/api/register" method="post">
			<label
				>Username<input
					bind:value={username}
					on:change={checkUsername}
					type="text"
					autocomplete="username"
					required
				/></label
			>
			<label
				>Password<input
					bind:value={password}
					type="password"
					autocomplete="new-password"
					required
				/></label
			>
			<label
				>Confirm Pasword<input
					bind:value={confirmPassword}
					type="password"
					autocomplete="new-password"
					required
				/></label
			>
			<input type="submit" />
		</form>
	</div>
{/if}
