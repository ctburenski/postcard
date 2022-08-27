<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { loggedInAs } from '$lib/loggedInAs';

	async function getLoggedInUser() {
		const result = await fetch('/api/auth/logged-in');
		try {
			return await result.json();
		} catch (e) {
			return null;
		}
	}

	async function logOut() {
		const result = await fetch('/api/auth/logout', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});
		if (result.ok) {
			$loggedInAs = null;
		}
	}

	onMount(async () => {
		$loggedInAs = await getLoggedInUser();
	});
</script>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		{#if !$loggedInAs}
			<li><a href="/login">Login</a></li>
			<li><a href="/register">Register</a></li>
		{/if}
		{#if $loggedInAs}
			<li><a on:click|preventDefault={logOut} href="/api/auth/logout">Log out</a></li>
		{/if}
	</ul>
</nav>
<slot />
