<template>
	<div v-if="timerVisible" class="fixed left-4 md:left-10 top-12">
		<div
			class="w-20 h-20 rounded-full bg-primary flex flex-col items-center justify-center"
		>
			<span class="text-white text-lg font-bold">{{ formattedTime }}</span>
			<small class="text-xs text-white text-center">Tiempo restante</small>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useConfiguracion } from '@/composables/useConfiguracion'

const { configuracion } = useConfiguracion()

const props = defineProps({
	timerVisible: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['timerFinished'])

const timeLeft = ref(configuracion.value.tiempoEspera * 60)
const desactivar = ref(false)

const formattedTime = computed(() => {
	const minutes = Math.floor(timeLeft.value / 60)
	const seconds = timeLeft.value % 60
	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`
})

const startTimer = () => {
	const timer = setInterval(() => {
		if (timeLeft.value > 0) {
			timeLeft.value--
		} else {
			clearInterval(timer)
			desactivar.value = true
			emit('timerFinished')
		}
	}, 1000)
}

watch(
	() => props.timerVisible,
	(newValue) => {
		if (newValue) {
			startTimer()
		}
	}
)

onMounted(() => {
	if (props.timerVisible) {
		startTimer()
	}
})
</script>
