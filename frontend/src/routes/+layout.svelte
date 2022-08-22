<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { messages } from '../lib/messages';

	let ok: boolean | null = null;

	const checkApi = async () => {
		const result = await fetch('/api/test');
		setTimeout(async () => {
			await checkApi();
		}, 20_000);
		ok = result.ok;
	};

	onMount(async () => {
		await checkApi();
		const messageApiResponse = await fetch('/api/messages');
		const messagesData = await messageApiResponse.json();
		if (messagesData.length > 0) {
			$messages = messagesData;
		}
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

<slot />
