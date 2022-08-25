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
			await getConnections();
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

	function removeConnection(userToRemove: string) {
		const removeFunction = async () => {
			const result = await fetch('/api/connection/remove-connection', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userToRemove
				})
			});
			if (result.status === 200) {
				await getConnections();
			}
		};
		return removeFunction;
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
				<li>
					{connection} -
					<a
						on:click|preventDefault={removeConnection(connection)}
						href="/api/connection/remove-connection">remove</a
					>
				</li>
			{/each}
		</ul>
	{/if}
{/if}
