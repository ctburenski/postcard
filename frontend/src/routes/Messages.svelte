<script>
	import { messages } from '$lib/messages';
	import { onMount } from 'svelte';

	async function getMessages() {
		const result = await fetch('/api/message/get-messages');
		if (result.status === 200) {
			const messagesData = await result.json();
			if (messagesData.length > 0) {
				$messages = messagesData;
			}
		}
	}

	onMount(async () => {
		await getMessages();
	});
</script>

{#if $messages.length > 0}
	<h1>Messages</h1>
	<ul>
		{#each $messages as message}
			<li>From {message.username}:<br />{message.message}</li>
		{/each}
	</ul>
{/if}
