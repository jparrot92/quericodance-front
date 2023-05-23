<script setup lang="ts">
import useAuth from '../composables/useAuth';

const { user, login } = useAuth();
</script>

<template>
    <q-page padding>
        <q-form class="row justify-center" @submit.prevent="login">
            <p class="col-12 text-h5 text-center">Login</p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
                <q-input
                    label="Email"
                    v-model="user.email"
                    lazy-rules
                    :rules="[
                        (val) => (val && val.length > 0) || 'Email is required'
                    ]"
                    type="email"
                />

                <q-input
                    label="Password"
                    v-model="user.password"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length > 0) || 'Password is required'
                    ]"
                />

                <div class="full-width q-pt-md">
                    <q-btn
                        label="Login"
                        color="primary"
                        class="full-width"
                        outline
                        rounded
                        type="submit"
                    />
                </div>
                <div class="full-width q-gutter-y-sm">
                    <q-btn
                        label="Register"
                        color="primary"
                        class="full-width"
                        flat
                        to="/register"
                        size="sm"
                    />
                    <q-btn
                        label="Forgot Password ?"
                        color="primary"
                        class="full-width"
                        flat
                        :to="{ name: 'forgot-password' }"
                        size="sm"
                    />
                </div>
            </div>
        </q-form>
    </q-page>
</template>
