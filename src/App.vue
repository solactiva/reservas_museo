<template>
	<main class="container mx-auto px-4 lg:px-36 py-0">
		<Toast position="top-center" :pt="{ root: 'w-11/12' }" />
		<Menubar class="mb-5">
			<template #start>
				<h1 class="text-lg font-bold text-primary">
					<a href="/">MUSEO DEL CHOCOLATE</a>
				</h1>
			</template>
			<template #end>
				<Button
					icon="pi pi-moon"
					iconPos="right"
					@click="toggleTheme"
					rounded
					text
				/>
			</template>
		</Menubar>
		<RouterView />
	</main>
</template>

<script setup>
const toggleTheme = () => {
	const theme = document.querySelector('html')
	theme.classList.toggle('p-dark')
	const icon = document.querySelector('.pi')
	icon.classList.toggle('pi-moon')
	icon.classList.toggle('pi-sun')
}
</script>
<style scoped></style>
