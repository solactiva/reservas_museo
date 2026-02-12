<template>
	<!--Formulario-->
	<Panel>
		<template #header>
			<div class="flex flex-col w-full text-center">
				<h2 class="text-2xl font-bold text-primary">DATOS DEL VISITANTE</h2>
				<div class="">
					{{ format(horario.fecha, 'long', 'es') }}
				</div>
			</div>
		</template>
		<form class="flex flex-col gap-4 w-full">
			<div class="flex gap-6">
				<div class="w-1/2 flex flex-col gap-4">
					<div
						class="flex-auto"
						v-for="(pago, index) in preciosFiltrados"
						:key="index"
					>
						<label :for="`cantidad-personas${index}`" class="block">
							{{ pago.tipo }}
						</label>
						<InputNumber
							inputClass="w-full"
							:inputId="`cantidad-personas${index}`"
							:invalid="invalid"
							v-model="reserva.cantidad[index].cantidad"
							showButtons
							buttonLayout="horizontal"
							:min="0"
							:max="
								cuposRestantes <= 0
									? reserva.cantidad[index].cantidad
									: horario.spots
							"
						>
							<template #incrementbuttonicon>
								<span class="pi pi-plus" />
							</template>
							<template #decrementbuttonicon>
								<span class="pi pi-minus" />
							</template>
						</InputNumber>
					</div>
				</div>
				<div class="flex w-1/2 items-end justify-between text-xl flex-col">
					<div class="flex flex-col items-end">
						<span class="font-bold">HORARIO</span>
						<span>{{ `${horario.inicioEvento} - ${horario.finEvento}` }}</span>
					</div>
					<div class="flex flex-col items-end">
						<span class="font-bold">CUPOS</span>
						<span>{{ cuposRestantes }}</span>
					</div>
					<div class="flex flex-col items-end">
						<span class="font-bold">TOTAL</span>
						<span>{{ precioTotal }} BOB</span>
					</div>
				</div>
			</div>
			<div>
				<label for="nombre-cliente">Nombre completo *</label>
				<InputText
					class="uppercase"
					type="text"
					fluid
					id="nombre-cliente"
					v-model="visitante.nombre"
					:invalid="visitante.nombre === '' && invalid"
				/>
			</div>
			<div>
				<label for="correo-cliente">Correo electrónico</label>
				<InputText
					class="lowercase"
					type="email"
					fluid
					id="correo-cliente"
					v-model="visitante.email"
				/>
			</div>
			<div>
				<label for="lugar-cliente">Desde donde nos visitas</label>
				<InputGroup>
					<Select
						v-model="searchCountry.country"
						:options="countries"
						optionLabel="country"
						placeholder="🌎"
						class="w-1/3"
						v-on:update:model-value="loadStates(searchCountry.country.code)"
					>
					</Select>
					<Select
						v-model="searchCountry.state"
						:disabled="searchCountry.country === null || states.length === 0"
						:loading="loadingState"
						:options="states"
						optionLabel="name"
						placeholder="Seleccione..."
						class="w-1/3"
						v-on:update:model-value="loadCities(searchCountry.state.id)"
					>
					</Select>
					<Select
						v-model="searchCountry.cytie"
						:disabled="searchCountry.state === null || cities.length === 0"
						:options="cities"
						:loading="loadingCity"
						optionLabel="name"
						placeholder="Seleccione..."
						class="w-1/3"
					>
					</Select>
				</InputGroup>
			</div>
			<div>
				<label for="numero-cliente">Número de teléfono *</label>
				<InputGroup>
					<Select
						v-model="selectedCountry"
						:options="countries"
						optionLabel="country"
						placeholder="🌎"
						class="w-2/5 sm:w-3/12"
					>
						<template #value="slotProps">
							<div v-if="slotProps.value" class="flex items-center">
								<img
									:alt="slotProps.value.country"
									:src="slotProps.value.flag"
									:class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`"
									style="width: 18px"
								/>
								<div>
									{{ `(+${slotProps.value.countryCode})` }}
								</div>
							</div>
							<span v-else>
								{{ slotProps.placeholder }}
							</span>
						</template>
						<template #option="slotProps">
							<div class="flex items-center">
								<img
									:alt="slotProps.option.label"
									:src="slotProps.option.flag"
									:class="`mr-2`"
									style="width: 18px"
								/>
								<div>
									{{ slotProps.option.country }} (+
									{{ slotProps.option.countryCode }})
								</div>
							</div>
						</template>
					</Select>
					<InputNumber
						v-model="numero"
						:invalid="numero === null && invalid"
						inputId="numero-cliente"
						:useGrouping="false"
						class="w-3/5 sm:w-9/12"
					/>
				</InputGroup>
			</div>
			<Button
				label="Registrar"
				icon="pi pi-calendar"
				size="large"
				:loading="loading"
				:disabled="loading"
				@click="registrarReserva"
			/>
		</form>
	</Panel>
</template>
<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { format } from '@formkit/tempo'
import { useReserva } from '@/composables/useReserva'
import { useEvento } from '@/composables/useEvento'
import countries from '@/data/countries.json'
import { useToast } from 'primevue/usetoast'
import { filtrarPrecios } from '@/config/tiposEntrada'

const {
	visitante,
	pago,
	horario,
	reserva,
	prereservar,
	getEstados,
	getCiudades,
} = useReserva()
const { evento } = useEvento()

const router = useRouter()
const toast = useToast()

const selectedCountry = ref({
	country: 'Bolivia',
	countryCode: 591,
	code: 'BO',
	flag: 'https://flagcdn.com/bo.svg',
	emoji: '🇧🇴',
	latinAmerica: true,
	phoneLength: 9,
})

const searchCountry = reactive({
	country: {
		country: 'Bolivia',
		countryCode: 591,
		code: 'BO',
		flag: 'https://flagcdn.com/bo.svg',
		emoji: '🇧🇴',
		latinAmerica: true,
		phoneLength: 9,
	},
	state: null,
	cytie: null,
})

const states = ref([
	{ id: 3375, name: 'Beni' },
	{ id: 3382, name: 'Chuquisaca' },
	{ id: 3381, name: 'Cochabamba' },
	{ id: 3380, name: 'La Paz' },
	{ id: 3376, name: 'Oruro' },
	{ id: 3379, name: 'Pando' },
	{ id: 3383, name: 'Potosí' },
	{ id: 3377, name: 'Santa Cruz' },
	{ id: 3378, name: 'Tarija' },
])

const cities = ref([])
const numero = ref(null)
const loading = ref(false)
const invalid = ref(false)
const loadingState = ref(false)
const loadingCity = ref(false)

const cuposRestantes = computed(
	() =>
		horario.value.spots -
		reserva.value.cantidad.reduce((acc, curr) => acc + curr.cantidad, 0)
)
const precioTotal = computed(() =>
	reserva.value.cantidad.reduce(
		(acc, curr) =>
			acc +
			preciosFiltrados.value.find((p) => p.tipo === curr.tipo).precio *
				curr.cantidad,
		0
	)
)

const preciosFiltrados = computed(() => {
	return filtrarPrecios(evento.value.precios)
})

const registrarReserva = async () => {
	if (
		visitante.value.nombre === '' ||
		numero.value === null ||
		precioTotal.value === 0
	) {
		invalid.value = true
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail:
				'Por favor, complete todos los campos o verifique que selecciono al menos un tipo de entrada',
			life: 3000,
		})
		return
	}

	invalid.value = false
	loading.value = true
	visitante.value.telefono = `${selectedCountry.value.countryCode}${numero.value}`
	visitante.value.pais = searchCountry.country.country ?? ''
	visitante.value.estado = searchCountry.state?.name ?? ''
	visitante.value.ciudad = searchCountry.cytie?.name ?? ''
	reserva.value.cantidadTotal = reserva.value.cantidad.reduce(
		(acc, curr) => acc + curr.cantidad,
		0
	)
	pago.value.total = precioTotal.value
	const exito = await prereservar()
	loading.value = false
	if (exito.success) {
		router.push({ name: 'PagoVisitante' })
		return
	}
	toast.add({
		severity: 'error',
		summary: 'Error',
		detail: exito.message,
		life: 3000,
	})
}
const loadStates = async (country) => {
	cities.value = []
	states.value = []
	searchCountry.state = null
	searchCountry.cytie = null
	loadingState.value = true
	states.value = await getEstados(country)
	loadingState.value = false
}
const loadCities = async (state) => {
	cities.value = []
	searchCountry.cytie = null
	loadingCity.value = true
	cities.value = await getCiudades(state)
	loadingCity.value = false
}
</script>
