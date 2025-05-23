<script setup>
    import { ref } from 'vue';
    import VueTailwindDatepicker from 'vue-tailwind-datepicker'
    import SelectedService from '@/components/SelectedService.vue';
    import { formatCurrency } from '@/helpers';
    import { useAppointmentsStore } from '@/stores/appointments';

    const appointments = useAppointmentsStore()

    const formatter = ref({
        date: 'DD/MM/YYYY',
        month: 'MMM'
    })

    const disableDate = (date) => {
        const today = new Date()
        return date < today || date.getMonth() > today.getMonth() + 1 || [0,6].includes(date.getDay())
    }
</script>

<template>
    <h2 class="text-4xl font-extrabold text-white mt-10">Detalles Cita y Resumen</h2>
    <p class="text-white text-lg mt-5">A continuacion verifica la infomacion y confirma tu cita</p>

    <h3 class="text-3xl font-extrabold text-white">Servicios</h3>

    <p  v-if="appointments.noServicesSlected" class="text-white text-2xl text-center">No hay servicios seleccionados</p>

    <div v-else class="grid gap-5">
        <SelectedService 
            v-for="service in appointments.services"
            :key="service._id"
            :service="service"
        />

        <p class="text-right text-white text-2xl">Total a pagar: 
            <span class="font-black">{{ formatCurrency(appointments.totalAmount) }}</span>
        </p>
    </div>

    <div class="space-y-8" v-if="!appointments.noServicesSlected">
        <h3 class="text-3xl font-extrabold text-white">Fecha y hora</h3>

        <div class="lg:flex gap-5 items-start">
            <div class="w-full lg:w-96 bg-white flex justify-center rounded-lg">
                <VueTailwindDatepicker 
                    :disable-date="disableDate"
                    i18n="es-mx"
                    as-single
                    no-input
                    :formatter="formatter"
                    v-model="appointments.date"
                />
            </div>

            <div v-if="appointments.isDateSelected" class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5  mt-10 lg:mt-0">
                <button
                    v-for="hour in appointments.hours"
                    :key="hour"
                    class="block text-blue-500 rounded-lg text-xl font-black p-3 disabled:opacity-10"
                    :class="appointments.time === hour ? 'bg-blue-500 text-white' : 'bg-white'"
                    @click="appointments.time = hour"
                    :disabled="appointments.disableTime(hour) ? true : false"
                >
                    {{ hour }}
                </button>
            </div>
        </div>

        <div v-if="appointments.isValidReservation" class="flex justify-end">
            <button 
                class="w-full md:w-auto bg-blue-500 p-3 rounded-lg uppercase font-black text-white"
                @click="appointments.saveAppointment"
            >
                Confimar Reservacion
            </button>
        </div>
    </div>
</template>



