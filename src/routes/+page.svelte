<script>
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="p-24">
	<div class="text-sm text-gray-500">Image here</div>
	<h1 class="text-3xl font-bold text-slate-800">Restauranteur</h1>
	<p>Let's take your dietary restrictions and find the perfect restaurant experience for you!</p>
	<div class="flex flex-col gap-4 pt-5">
		<input
			type="text"
			placeholder="Walk us through your prefences"
			class="w-full rounded-md p-4 ring-2 ring-slate-400 hover:ring-slate-800 focus-visible:ring-slate-800"
		/>
		<Button class="md:max-w-48">Curate Restaurants</Button>
	</div>
</div>
