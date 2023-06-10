<script setup lang="ts">
import useAuth from '../composables/useAuth';

const { userForm, onSubmit } = useAuth();
</script>

<template>
    <q-page padding>
        <q-form class="row justify-center" @submit.prevent="onSubmit">
            <p class="col-12 text-h5 text-center">Login</p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
                <q-input
                    :label="$t('auth.label.email')"
                    v-model="userForm.email"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length > 0) ||
                            $t('auth.validations.emailRequired')
                    ]"
                    type="email"
                />

                <q-input
                    :label="$t('auth.label.password')"
                    v-model="userForm.password"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length > 0) ||
                            $t('auth.validations.passwordRequired')
                    ]"
                />

                <div class="full-width q-pt-md">
                    <q-btn
                        :label="$t('auth.label.login')"
                        color="primary"
                        class="full-width"
                        outline
                        rounded
                        type="submit"
                    />
                </div>
                <div class="full-width q-gutter-y-sm">
                    <q-btn
                        :label="$t('auth.label.forgotPassword')"
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
