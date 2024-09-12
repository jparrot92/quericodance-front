<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import useAuth from '../composables/useAuth';

const route = useRoute();
const { userForm, onSubmit } = useAuth();

const $q = useQuasar();

const isPwd = ref<boolean>(true);

onMounted(() => {
    const activated = route.query.activated;
    if (activated) {
        $q.notify({
            type: 'positive',
            message: '¡Tu cuenta ha sido activada exitosamente!',
            timeout: 3000,
            position: 'top',
        });
    }
});
</script>

<template>
    <q-header elevated>
        <q-toolbar>
            <q-toolbar-title>{{ $t('auth.login') }}</q-toolbar-title>
        </q-toolbar>
    </q-header>
    <q-page padding>
        <q-form class="row justify-center" @submit.prevent="onSubmit">
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
                <q-input
                    :label="$t('auth.email')"
                    v-model="userForm.email"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required'),
                    ]"
                    type="email"
                />

                <q-input
                    :label="$t('auth.password')"
                    v-model="userForm.password"
                    :type="isPwd ? 'password' : 'text'"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required'),
                    ]"
                >
                    <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                    </template>
                </q-input>

                <div class="full-width q-pt-md">
                    <q-btn
                        :label="$t('auth.login')"
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
                        :to="{ name: 'register' }"
                        size="sm"
                    />
                    <q-btn
                        :label="$t('auth.forgotPassword')"
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
