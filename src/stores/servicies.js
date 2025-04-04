import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import ServiciesAPI from "@/api/ServiciesAPI";

export const useServiciesStore = defineStore('services', () => {

    const services = ref([])

    onMounted(async () => {
        try {
            const { data } = await ServiciesAPI.all()
            services.value = data
            
        } catch (error) {
            console.log(error);
        }
    })

    return {
        services
    }
})