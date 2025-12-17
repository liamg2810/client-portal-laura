<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount, type Snippet } from 'svelte';
	import '../layout.css';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Navbar username={data.user.username} roles={data.roles} />

<div class="m-2">
	{@render children()}
</div>
