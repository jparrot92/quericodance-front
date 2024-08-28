<script setup lang="ts">
import { ref } from 'vue';
import useAuth from '../composables/useAuth';

const { sendMailRequestResetPassword } = useAuth();

const password = ref<string>('');

const handleForgotPassword = () => {
    try {
        sendMailRequestResetPassword(password.value);
    } catch (error) {
        console.error(error);
    }
};
</script>
<template>
    <q-page padding>
        <q-form
            class="row justify-center"
            @submit.prevent="handleForgotPassword"
        >
            <p class="col-12 text-h5 text-center"></p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
                <q-input
                    label="Email"
                    v-model="password"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required'),
                    ]"
                    type="email"
                />

                <div class="full-width q-gutter-y-sm">
                    <q-btn
                        :label="$t('auth.recover')"
                        color="primary"
                        class="full-width"
                        outline
                        rounded
                        type="submit"
                    />
                </div>
            </div>
        </q-form>
    </q-page>
</template>
