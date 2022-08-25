<script lang="ts">
	import { messages } from '$lib/messages';
	import { loggedInAs } from '$lib/loggedInAs';
	import { onMount } from 'svelte';

	let userToRequest = '';

	async function submitForm() {
		const result = await fetch('/api/connection/offer-connection', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userToRequest
			})
		});
		if (result.status === 200) {
		}
	}

	let connections: string[] = [];
	async function getConnections() {
		const result = await fetch('/api/connection/connections');
		if (result.status === 200) {
			const data = await result.json();
			connections = data;
		}
	}

	onMount(async () => {
		await getConnections();
	});
</script>

{#if $loggedInAs}
	<p>Hello, {$loggedInAs.username}!</p>
	<h1>Connect!</h1>
	<form
		on:submit|preventDefault={submitForm}
		action="/api/connection/offer-connection"
		method="PUT"
	>
		<label
			>User
			<input bind:value={userToRequest} type="text" required />
		</label>
		<input type="submit" />
	</form>
	{#if connections.length}
		<h1>Connections</h1>
		<ul>
			{#each connections as connection}
				<li>{connection}</li>
			{/each}
		</ul>
	{/if}
{/if}
