<script lang="ts">
	import { loggedInAs } from '$lib/loggedInAs';
	import { messages } from '$lib/messages';
	import Connections from './Connections.svelte';
	import Messages from './Messages.svelte';

	let userToSendTo = '';
	let newMessage = '';
	async function sendMessage() {
		const result = await fetch('/api/message/send-message', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userToSendTo,
				message: newMessage
			})
		});
		if (result.status === 200) {
			const messageApiResponse = await fetch('/api/message/get-messages');
			const messagesData: any[] = await messageApiResponse.json();
			if (messagesData.length > 0) {
				$messages = messagesData;
			}
		}
	}
</script>

{#if $loggedInAs}
	<p>Hello, {$loggedInAs.username}!</p>
	<Connections />
	<Messages />
	<h1>Message a user</h1>
	<form on:submit|preventDefault={sendMessage} action="/api/message/send-message" method="POST">
		<label>user<input bind:value={userToSendTo} type="text" /></label>
		<input bind:value={newMessage} type="text" />
		<input type="submit" />
	</form>
{:else}
	<h1>Welcome!</h1>
{/if}
