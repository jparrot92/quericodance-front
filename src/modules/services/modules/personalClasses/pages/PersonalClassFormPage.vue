<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import usePersonalClasses from '../composables/usePersonalClasses';

const route = useRoute();

const idPersonalClass = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const {
    personalClass,
    loadPersonalClass,
    savePersonalClass,
    editPersonalClass,
} = usePersonalClasses();

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
                    :label="$t('shared.name') + '*'"
                    v-model="personalClass.name"
                />

                <q-input
                    type="number"
                    :label="$t('personalClass.sessions') + '*'"
                    v-model.number="personalClass.sessions"
                />

                <q-input
                    type="number"
                    :label="$t('personalClass.price') + '*'"
                    v-model.number="personalClass.price"
                />

                <pd-editor
                    :label="$t('shared.description') + '*'"
                    v-model="personalClass.description"
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
