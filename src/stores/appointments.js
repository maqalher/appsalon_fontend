import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";

export const useAppointmentsStore = defineStore('appointmens', () => {
    
    const services = ref([])
    const date = ref('')
    const hours = ref([])
    const time = ref('')

    onMounted(() => {
        const startHour = 10
        const endHour = 19
        for(let hour = startHour; hour <= endHour; hour++){
            hours.value.push(hour + ':00')
        }
    })

    function onServiceSlected(service){
        if(services.value.some(selectedService => selectedService._id === service._id)){
            services.value = services.value.filter(selectedService => selectedService._id !== service._id)
        }else{
            if(services.value.length === 2){
                alert('Maximo 2 servicios por cita')
                return
            }
            services.value.push(service)   
        }
    }

    function createAppointmen(){
        const appointment = {
            services: services.value.map(service => service._id),
            date: date.value,
            time: time.value,
            totalAmount: totalAmount.value
        }

        console.log(appointment);
        
        
    }

    const isServiceSelected = computed(() => {
        return (id) => services.value.some(service => service._id === id)
    })

    const noServicesSlected = computed(() => services.value.length === 0)

    const totalAmount = computed(() => {
        return services.value.reduce((total, service) => total + service.price, 0)
    })

    const isValidReservation = computed(() => {
        return services.value.length && date.value.length && time.value.length
    })

    return {
        services,
        date,
        hours,
        time,
        isServiceSelected,
        isValidReservation,
        totalAmount,
        noServicesSlected,
        onServiceSlected,
        createAppointmen
    }
})