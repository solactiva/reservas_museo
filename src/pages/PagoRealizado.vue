<template>
	<div class="text-center text-9xl my-16">🎉</div>
	<div class="card">
		<h3 class="text-3xl text-center mb-7">
			Gracias, el pago de tu reserva está en proceso de verificación
		</h3>
		<p class="text-center">
			Una vez confirmada tu reserva, enviaremos el detalle a tu correo
			electrónico
			<span class="text-xl font-bold italic">{{ visitante.email }}</span
			>. Si no recibes el correo electrónico, revisa tu carpeta de correo no
			deseado. Tu reserva esta en proceso, para validar tu pago de forma segura contactanos al 
			<a 
				href="https://wa.me/59172877493?text=Hola%2C%20quiero%20validar%20mi%20reserva" 
				target="_blank"
				class="text-lg font-bold text-green-600 hover:text-green-700 underline"
			>
				72877493 (WhatsApp)
			</a>
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
import { useReserva } from '@/composables/useReserva'

const { visitante } = useReserva()

const volverAlInicio = () => {
	window.location.href = '/'
}
</script>
