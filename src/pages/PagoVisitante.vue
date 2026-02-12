<template>
	<TimerComponent :timerVisible="true" @timerFinished="returnToHome" />
	<h1 class="text-center text-2xl font-bold text-primary">PAGO DE RESERVA</h1>
	<div class="grid grid-cols-1 md:grid-cols-2">
		<div>
			<Image alt="QR Codeage" preview>
				<template #previewicon>
					<i class="pi pi-search"></i>
				</template>
				<template #image>
					<img
						ref="qrImage"
						:src="configuracion.qrPago"
						alt="image"
						class="w-1/2 mx-auto"
					/>
				</template>
				<template #preview="slotProps">
					<img
						:src="configuracion.qrPago"
						alt="preview"
						class="w-full md:w-3/5 mx-auto"
						:style="slotProps.style"
						@click="slotProps.onClick"
					/>
				</template>
			</Image>
			<div class="flex justify-center gap-4">
				<Button
					label="Guardar QR"
					icon="pi pi-download"
					size="small"
					@click="guardarQr"
				/>
				<Button
					label="Compartir"
					icon="pi pi-share-alt"
					size="small"
					@click="compartirQr"
				/>
			</div>
			<div class="text-center text-xl font-semibold my-4">
				Total: {{ pago.total }} BOB.
			</div>
		</div>
		<div class="flex flex-col gap-3 mt-10">
			<ConfirmDialog>
				<template #message>
					<img
						v-if="src"
						:src="src"
						alt="Image"
						class="rounded-xl h-full w-64"
					/>
				</template>
			</ConfirmDialog>
			<FileUpload
				mode="basic"
				name="comprobante"
				accept="image/*"
				:maxFileSize="5000000"
				invalidFileSizeMessage="Tamaño de archivo excedido"
				invalidFileTypeMessage="Tipo de archivo no permitido"
				@select="onUpload"
				customUpload
				auto
				chooseLabel="Subir comprobante"
				chooseIcon="pi pi-upload"
				:chooseButtonProps="{ size: 'large', severity: 'primary' }"
				class="w-full"
			/>
			<Button
				label="Registrar Pago"
				icon="pi pi-check"
				size="large"
				@click="registrarPago"
				:severity="disabledButton ? 'secondary' : 'primary'"
				:disabled="disabledButton"
				:loading="loading"
			/>
		</div>
	</div>
</template>
<script setup>
import TimerComponent from '@/components/TimerComponent.vue'
import { ref, computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useReserva } from '@/composables/useReserva'
import { useConfiguracion } from '@/composables/useConfiguracion'

const { configuracion } = useConfiguracion()
const { pago, pagarReserva } = useReserva()

const toast = useToast()
const confirm = useConfirm()
const router = useRouter()

const qrImage = ref(null)
const src = ref(null)
const loading = ref(false)

const guardarQr = async () => {
	try {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		canvas.width = '600'
		canvas.height = '600'
		ctx.drawImage(qrImage.value, 0, 0, canvas.width, canvas.height)

		const dataUrl = canvas.toDataURL('image/jpg')
		const link = document.createElement('a')
		link.href = dataUrl
		link.download = 'qr-code.jpg'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		toast.add({
			severity: 'success',
			summary: 'Éxito',
			detail: 'Imagen QR guardada en descargas',
			life: 3000,
		})
	} catch (error) {
		console.error('Error al guardar la imagen:', error)
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'No se pudo guardar la imagen QR',
			life: 3000,
		})
	}
}

const compartirQr = async () => {
	if (navigator.share) {
		try {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			canvas.width = '600'
			canvas.height = '600'
			ctx.drawImage(qrImage.value, 0, 0, canvas.width, canvas.height)

			const blob = await new Promise((resolve) =>
				canvas.toBlob(resolve, 'image/png')
			)
			const file = new File([blob], 'qr-code.png', { type: 'image/png' })

			await navigator.share({
				files: [file],
			})

			toast.add({
				severity: 'success',
				summary: 'Éxito',
				detail: 'Imagen QR compartida',
				life: 3000,
			})
		} catch (error) {
			console.error('Error al compartir:', error)
			if (error.name === 'AbortError') {
				toast.add({
					severity: 'info',
					summary: 'Información',
					detail: 'Compartir cancelado',
					life: 8000,
				})
			} else {
				toast.add({
					severity: 'error',
					summary: 'Error',
					detail: 'No se pudo compartir la imagen QR',
					life: 3000,
				})
			}
		}
	} else {
		toast.add({
			severity: 'warn',
			summary: 'Aviso',
			detail: 'No se pudo compartir. Por favor, guarda la imagen manualmente.',
			life: 3000,
		})
	}
}

const onUpload = (event) => {
	const file = event.files[0]
	const reader = new FileReader()

	reader.onload = async (e) => {
		src.value = e.target.result
	}

	reader.readAsDataURL(file)

	confirm.require({
		header: 'Comprobante de pago',
		rejectProps: {
			label: 'Cancelar',
			severity: 'secondary',
			outlined: true,
		},
		acceptProps: {
			label: 'Correcto',
		},
		accept: () => {
			pago.value.comprobante = src.value

			toast.add({
				severity: 'success',
				summary: 'Confirmación',
				detail: 'Comprobante listo para ser enviado',
				life: 3000,
			})
		},
		reject: () => {
			toast.add({
				severity: 'warn',
				summary: 'Cancelado',
				detail: 'Cancelaste la subida del comprobante',
				life: 3000,
			})
		},
	})
}

const tiempoFinalizado = ref(false)
const disabledButton = computed(() => {
	if (tiempoFinalizado.value) return true
	if (loading.value) return true
	if (!pago.value.comprobante) return true
	return false
})

const returnToHome = () => {
	router.push({ name: 'Eventos' })
}

const registrarPago = async () => {
	loading.value = true
	const exito = await pagarReserva()
	loading.value = false

	if (!exito.success) {
		router.push({ name: 'ReservaRechazada' })
		return
	}

	router.push({ name: 'PagoRealizado' })
	return
}

toast.add({
	severity: 'info',
	summary: 'Información',
	detail: `Tiene ${configuracion.value.tiempoEspera} minutos para realizar el pago, de otra forma los cupos serán liberados y tendrás que iniciar el registro nuevamente`,
	life: 8000,
})
</script>
