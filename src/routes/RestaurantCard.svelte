<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Star } from 'lucide-svelte';

	export let restaurantName = '';
	export let restaurantAddress = '';
	export let restaurantRating = 0;
</script>

<div class="pb-6">
	<Card>
		<CardHeader>
			<CardTitle>{restaurantName}</CardTitle>
			<div class="flex flex-row">
				{#each Array(Math.round(restaurantRating)) as _, index}
					<Star fill="red" />
				{/each}
			</div>
		</CardHeader>
		<CardContent>{restaurantAddress}</CardContent>
	</Card>
</div>
