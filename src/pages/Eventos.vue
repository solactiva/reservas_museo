<template>
	<div class="flex flex-col gap-5">
		<div
			class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center"
			v-for="(evento, index) in eventos"
			:key="index"
		>
			<div
				class="box p-6 w-full animate-duration-500"
				style=""
				data-pd-animateonscroll="true"
			>
				<div class="font-semibold mb-4 text-lg text-primary">
					{{ evento.nombre }}
				</div>
				<p class="m-0 text-surface-500 dark:text-surface-400 font-medium">
					{{ evento.descripcion }}
				</p>
				<div class="flex gap-4 mt-1 justify-end">
					<Button
						label="Reservar"
						outlined
						class="w-32"
						as="router-link"
						:to="`/${evento.identificador}`"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useEvento } from '@/composables/useEvento'

const { eventos, cargarEventos } = useEvento()

cargarEventos()
</script>
<style scoped>
.animate-duration-500 {
	animation-duration: 0.5s;
}

.box {
	background-color: var(--card-background);
	border: 1px solid var(--border-color);
	border-radius: 10px;
	position: relative;
	z-index: 0;
}

.box:after,
.box:before {
	animation: clippath 3s linear infinite;
	border: 2px solid var(--home-box-ring-color);
	border-radius: 10px;
	bottom: -2px;
	content: '';
	left: -2px;
	opacity: 0;
	position: absolute;
	right: -2px;
	top: -2px;
	transition: all 0.5s;
	z-index: -1;
}

.box:after {
	animation: clippath 3s linear -1.5s infinite;
}

.box:hover:after,
.box:hover:before {
	opacity: 1;
}

@keyframes clippath {
	0%,
	to {
		clip-path: inset(0 0 98% 0);
	}

	25% {
		clip-path: inset(0 98% 0 0);
	}

	50% {
		clip-path: inset(98% 0 0 0);
	}

	75% {
		clip-path: inset(0 0 0 98%);
	}
}
</style>
