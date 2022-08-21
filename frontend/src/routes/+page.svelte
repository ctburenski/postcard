<script lang="ts">
	import { messages } from './messages';
	let messageList: string[];
	messages.subscribe((messages) => (messageList = messages));
</script>

<h1>Hello!</h1>
{#each messageList as message, index}
	<h3>Message {index + 1}</h3>
	<p>{message}</p>
{/each}
