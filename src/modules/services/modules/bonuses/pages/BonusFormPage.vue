<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import useBonuses from '../composables/useBonuses';

const route = useRoute();

const idBonus = computed<string | undefined>(() => route.params.id?.toString());

const { bonus, loadBonus, saveBonus, editBonus } = useBonuses();

const onSubmit = async () => {
    if (idBonus.value) {
        editBonus(idBonus.value);
    } else {
        saveBonus();
    }
};

onMounted(() => {
    if (idBonus.value) {
        loadBonus(idBonus.value);
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
                <q-input :label="$t('bonus.name') + '*'" v-model="bonus.name" />

                <q-input
                    type="number"
                    :label="$t('bonus.sessions') + '*'"
                    v-model.number="bonus.sessions"
                />

                <q-input
                    type="number"
                    :label="$t('bonus.price') + '*'"
                    v-model.number="bonus.price"
                />

                <pd-editor
                    :label="$t('bonus.description') + '*'"
                    v-model="bonus.description"
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
