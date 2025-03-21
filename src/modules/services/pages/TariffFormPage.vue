<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { SessionFrequency } from 'src/types/UtilTypes';

import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useTariffs from '../composables/useTariffs';

const route = useRoute();

const idTariff = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const { generateEnumOptions } = useEnumOptions();
const { tariff, loadTariff, saveTariff, editTariff } = useTariffs();

const sessionFrequency = generateEnumOptions(SessionFrequency);

const onSubmit = async () => {
    if (idTariff.value) {
        editTariff(idTariff.value);
    } else {
        saveTariff();
    }
};

onMounted(() => {
    if (idTariff.value) {
        loadTariff(idTariff.value);
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
                    :label="$t('shared.name') + '*'"
                    v-model="tariff.name"
                />

                <q-input
                    type="number"
                    :label="$t('tariff.sessions') + '*'"
                    v-model.number="tariff.sessions"
                />

                <pd-select
                    v-model="tariff.sessionFrequency"
                    :label="$t('tariff.sessionFrequency') + '*'"
                    :options="sessionFrequency"
                />

                <q-input
                    type="number"
                    :label="$t('tariff.price') + '*'"
                    v-model.number="tariff.price"
                />

                <pd-editor
                    :label="$t('shared.description') + '*'"
                    v-model="tariff.description"
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
