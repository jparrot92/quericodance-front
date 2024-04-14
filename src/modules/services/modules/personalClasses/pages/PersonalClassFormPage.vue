<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { SessionFrequency, PaymentFrequency } from 'src/types/UtilTypes';

import useEnumOptions from 'src/shared/composables/useEnumOptions';

import usePersonalClasses from '../composables/usePersonalClasses';

const route = useRoute();

const idPersonalClass = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const { generateEnumOptions } = useEnumOptions();
const { personalClass, loadPersonalClass, savePersonalClass, editPersonalClass } = usePersonalClasses();

const sessionFrequency = generateEnumOptions(SessionFrequency);
const paymentFrequency = generateEnumOptions(PaymentFrequency);

const onSubmit = async () => {
    if (idPersonalClass.value) {
        editPersonalClass(idPersonalClass.value);
    } else {
        savePersonalClass();
    }
};

onMounted(() => {
    if (idPersonalClass.value) {
        loadPersonalClass(idPersonalClass.value);
    }
});
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <q-form
                class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
                @submit.prevent="onSubmit"
            >
                <q-input
                    :label="$t('personalClass.name') + '*'"
                    v-model="personalClass.name"
                />

                <q-input
                    type="number"
                    :label="$t('personalClass.sessions') + '*'"
                    v-model.number="personalClass.sessions"
                />

                <pd-select
                    v-model="personalClass.sessionFrequency"
                    :label="$t('personalClass.sessionFrequency') + '*'"
                    :options="sessionFrequency"
                />

                <pd-select
                    v-model="personalClass.paymentFrequency"
                    :label="$t('personalClass.paymentFrequency') + '*'"
                    :options="paymentFrequency"
                />

                <q-input
                    type="number"
                    :label="$t('personalClass.price') + '*'"
                    v-model.number="personalClass.price"
                />

                <q-input
                    v-model="personalClass.description"
                    :label="$t('personalClass.description') + '*'"
                    type="textarea"
                />

                <q-btn
                    :label="$t('shared.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
