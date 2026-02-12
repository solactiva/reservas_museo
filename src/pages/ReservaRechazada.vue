<template>
	<div class="text-center text-9xl my-16">😥</div>
	<div class="card">
		<h3 class="text-3xl text-center mb-7">
			Lo sentimos, no hemos podido concretar tu reserva
		</h3>
		<p class="text-center">
			Lamentablemente, no hay cupos disponibles para la fecha seleccionada.
			Queremos ofrecerte una solución: <br>
			<ul class="list-disc list-inside text-center">
				<li>Nos pondremos en contacto contigo lo
					antes posible para brindarte más información. </li>
					<li> Te reembolsaremos el monto total de tu reserva a la brevedad. </li>
			</ul>
		</p>
		<p class="text-center mt-4">
			Gracias por tu comprensión. Si tienes alguna pregunta, no dudes en contactarnos.
		</p>
	</div>
	<div class="flex justify-center gap-4 mt-10">
		<Button
			label="Volver al inicio"
			icon="pi pi-home"
			size="large"
			@click="volverAlInicio"
		/>
	</div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useReserva } from '@/composables/useReserva'

const { visitante } = useReserva()
const router = useRouter()

const volverAlInicio = () => {
	router.push({ name: 'Home' })
}
</script>
