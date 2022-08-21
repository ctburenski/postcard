<script lang="ts">
	import { onMount } from 'svelte';
	import { messages } from './messages';

	let ok: boolean | null = null;

	const checkApi = async () => {
		const result = await fetch('/api');
		setTimeout(async () => {
			await checkApi();
		}, 20_000);
		ok = result.ok;
	};

	onMount(async () => {
		await checkApi();
		const messageApiResponse = await fetch('/api/messages');
		const messagesData = await messageApiResponse.json();
		messages.set(messagesData);
	});
</script>

{#if ok !== null}
	{#if ok}
		<p>✅</p>
	{:else}
		<p>⚠️</p>
	{/if}
{:else}
	<p>⏳</p>
{/if}

<p><a href="/auth">Login</a></p>
<slot />
