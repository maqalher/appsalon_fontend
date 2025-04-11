import { ref, onMounted, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import AuthAPI from "@/api/AuthAPI.js";
import AppiontmentAPI from "@/api/AppiontmentAPI.js";

export const useUserStore = defineStore('user', () => {

    const router = useRouter()
    const user = ref({})
    const userAppointments = ref([])
    const loading = ref(true)

    onMounted( async() => {
        try {
            // obtiene sesion del usuario
            const { data } = await AuthAPI.auth()
            user.value = data
            // console.log(data);
            // obtiene consultas del usuario
            await getUserAppointments()
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false
        }
    })

    async function getUserAppointments(){
        const { data } = await AppiontmentAPI.getUserAppointments(user.value._id)
        userAppointments.value = data
    }

    function logout() {
        localStorage.removeItem("AUTH_TOKEN")
        user.value = {}
        router.push({name: 'login'})
    }

    const getUserName = computed(() => user.value?.name ? user.value?.name : '')

    const noAppointments = computed(() => userAppointments.value.length ===  0)

    return {
        user,
        userAppointments,
        getUserAppointments,
        noAppointments,
        loading,
        getUserName,
        logout
    }
})