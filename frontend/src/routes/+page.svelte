<script lang="ts">
	import { messages } from '$lib/messages';
	import { loggedInAs } from '$lib/loggedInAs';
</script>

{#if $loggedInAs}
	<p>Hello, {$loggedInAs.username}!</p>
	{#each $messages as message, index}
		<h3>Message {index + 1}</h3>
		<p>{message}</p>
	{/each}
{/if}
