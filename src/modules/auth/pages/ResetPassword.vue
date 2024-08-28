<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import useAuth from '../composables/useAuth';

const route = useRoute();

const { resetPassword } = useAuth();

const token = route.query.token as string;
const password = ref<string>('');
</script>
<template>
    <q-page padding>
        <q-form
            class="row justify-center"
            @submit.prevent="resetPassword(token, password)"
        >
            <p class="col-12 text-h5 text-center"></p>
            <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
                <q-input
                    :label="$t('auth.newPassword')"
                    v-model="password"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length >= 6) ||
                            $t('shared.validations.required'),
                    ]"
                />

                <div class="full-width q-gutter-y-sm">
                    <q-btn
                        :label="$t('auth.change')"
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
