<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<form method="post" action="?/createUser" use:enhance>
	<input name="email" type="email" />
	<input type="password" name="password" />
	<button>Submit</button>
</form>

<p style="color: red">{form?.message ?? ''}</p>

{#each data.users as user}
	<p>{user.user.email} - {user.role.name}</p>
{/each}
