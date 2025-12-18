<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<form method="post" action="?/createUser" use:enhance>
	<input name="email" type="email" placeholder="New user email" />
	<!-- <input type="password" name="password" /> -->
	<button>Submit</button>
</form>

<p style="color: red">{form?.message ?? ''}</p>

{#if form?.code}
	<p>Magic link created: {page.url.host}/onboarding/{form.code}</p>
{/if}

Current Users:

{#each data.users as user}
	<p>{user.user.email} - {user.role.name}</p>
{/each}
