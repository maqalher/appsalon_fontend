<script setup>
    import { inject } from 'vue';
    import { reset } from '@formkit/vue'
    import AuthAPI from '@/api/AuthAPI';

    const toast = inject('toast')

    const handleSubmit = async({password_confirm, ...formData}) => {
        try {
            const { data } = await AuthAPI.register(formData)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            reset('registerForm')
        } catch (error) {
            // console.log(error);
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
        
    }
</script>

<template>
    <h1 class="text-6xl font-extrabold text-white text-center mt-6">Crea una cuenta</h1>
    <p class="text-2xl text-white text-center my-5">Crea una cuenta en AppSalon</p>

    <FormKit
        id="registerForm"
        type="form"
        :actions="false"
        incomplete-message="No se pudo enviar, revisa las notificaciones"
        @submit="handleSubmit"
    >
        <FormKit 
            type="text"
            label="Nombre"
            name="name"
            placeholder="Tu Nombre"
            validation="required|length:3"
            :validation-messages="{
                required: 'El Nombre es obligatorio',
                length: 'El Nombre es muy corto'}"
        />

        <FormKit 
            type="email"
            label="Email"
            name="email"
            placeholder="Email de Registro"
            validation="required|email"
            :validation-messages="{
                required: 'El Email es obligatorio',
                email: 'Email no valido'}"
        />

        <FormKit 
            type="password"
            label="Password"
            name="password"
            placeholder="Password de Usuario - Min 8 Caracteres"
            validation="required|length:8"
            :validation-messages="{
                required: 'El Password es obligatorio',
                email: 'El Password debe contener al menos 8 caracteres'}"
        />

        <FormKit 
            type="password"
            label="Repetir Password"
            name="password_confirm"
            placeholder="Repite el Password"
            validation="required|confirm"
            :validation-messages="{
                required: 'El Password es obligatorio',
                email: 'Los Passwords no son iguales'}"
        />

        <FormKit 
            type="submit"
        >Crear Cuenta</FormKit>
    </FormKit>
</template>


