import { ref, computed, onMounted, inject, watch } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import AppiontmentAPI from "@/api/AppiontmentAPI";
import { convertToISO, convertToDDMMYYYY } from "@/helpers/date";
import { useUserStore } from "./user";

export const useAppointmentsStore = defineStore('appointmens', () => {
    
    const appointmentId = ref('')
    const services = ref([])
    const date = ref('')
    const hours = ref([])
    const time = ref('')
    const appointmentsByDate = ref([])

    const toast = inject('toast')
    const router = useRouter()
    const user = useUserStore()

    onMounted(() => {
        const startHour = 10
        const endHour = 19
        for(let hour = startHour; hour <= endHour; hour++){
            hours.value.push(hour + ':00')
        }
    })

    watch(date, async() => {
        time.value = ''
        if(date.value === '') return
        // Obtenemos las citas
        const { data } = await AppiontmentAPI.getByDate(date.value)
        
        
        // console.log(data);

        if(appointmentId.value){
            // Edicion
            
            // recuperar la hora seleccioda
            appointmentsByDate.value = data.filter( appointment => appointment._id !==  appointmentId.value)
            // asginar nuevamente la hora seleccionada para mostrar boton para continuar o cambiar
            time.value = data.filter( appointment => appointment._id ===  appointmentId.value)[0].time
        }else {
            // Registro nuevo
            appointmentsByDate.value = data
        }
        
    })

    function setSelectedAppointment(appointment) {
        // console.log(appointment);
        // Asignar valorea al edit 
        services.value = appointment.services
        date.value = convertToDDMMYYYY(appointment.date)
        time.value = appointment.time
        appointmentId.value = appointment._id

        // console.log(appointmentId.value);   
    }

    function onServiceSlected(service){
        if(services.value.some(selectedService => selectedService._id === service._id)) {
            services.value = services.value.filter( selectedService => selectedService._id !== service._id )
        } else {
            if(services.value.length === 2) {
                alert('Máximo 2 servicios por cita')
                return
            }
            services.value.push(service)
        }
    }

    async function saveAppointment(){
  
        const appointment = {
            services: services.value.map( service => service._id),
            date: convertToISO( date.value ), // formatear fecha para mongo
            time: time.value,
            totalAmount: totalAmount.value
        }

        if(appointmentId.value ) {
            // Editando
            try {
                const { data } = await AppiontmentAPI.update(appointmentId.value, appointment)
                toast.open({
                    message: data.msg,
                    type:'success'
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            // Nueva Cita
            try {
                const { data } = await AppiontmentAPI.create(appointment)
                toast.open({
                    message: data.msg,
                    type:'success'
                })
            } catch (error) {
                console.log(error)
            }
        }

        clearAppointmentData()
        user.getUserAppointments()
        router.push({name: 'my-appointments'})

    }   

    function clearAppointmentData() {
        appointmentId.value = ''
        services.value = []
        date.value = ''
        time.value = ''
    }

    async function cancelAppointment(id) {
        if(confirm('¿Deseas cancelar esta cita?')) {
            try {
                const { data } = await AppiontmentAPI.delete(id)
                toast.open({
                    message: data.msg,
                    type: 'success'
                })

                user.userAppointments = user.userAppointments.filter( appointment => appointment._id !== id)
            } catch (error) {
                toast.open({
                    message: error.response.data.msg,
                    type: 'error'
                })
            }
        }
        
    }

    const isServiceSelected = computed(() => {
        return (id) =>  services.value.some( service => service._id === id )
    })

    const noServicesSlected = computed(() => services.value.length === 0)

    const totalAmount = computed(() => {
        return services.value.reduce((total, service) => total + service.price, 0)
    })

    const isValidReservation = computed(() => {
        return services.value.length && date.value.length && time.value.length
    })

    const isDateSelected = computed(() => {
        return date.value ? true : false
    })

    const disableTime = computed(() => {
        return (hour) => {
            return appointmentsByDate.value.find(appointment => appointment.time === hour)
        }
    })

    return {
        services,
        date,
        hours,
        time,
        isServiceSelected,
        isValidReservation,
        isDateSelected,
        totalAmount,
        noServicesSlected,
        onServiceSlected,
        setSelectedAppointment,
        saveAppointment,
        clearAppointmentData,
        cancelAppointment,
        disableTime,
    }
})