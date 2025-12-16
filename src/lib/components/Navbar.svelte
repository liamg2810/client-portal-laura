<script lang="ts">
	import { enhance } from '$app/forms';

	let { username }: { username: string } = $props();
</script>

<div class="mb-4 flex h-12 items-center justify-between bg-indigo-800 p-4 text-white">
	<nav>
		<a href="/">Home</a>
	</nav>

	<div class="flex gap-4">
		<span>Hello, {username}</span>
		<form action="/?/logout" method="post" use:enhance>
			<button class="font-bold">Logout</button>
		</form>
	</div>
</div>
