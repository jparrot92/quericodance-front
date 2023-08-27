<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import useActivities from '../composables/useActivities';

const route = useRoute();

const { id } = route.params as { id: string };

const isUpdate = computed(() => route.params.id);

const { activity, loadActivity, saveActivity, editActivity } = useActivities();

onMounted(() => {
    if (isUpdate.value) {
        loadActivity(id);
    }
});

const onSubmit = async () => {
    if (isUpdate.value) {
        editActivity(id);
    } else {
        saveActivity();
    }
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <q-form
                class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
                @submit.prevent="onSubmit"
            >
                <q-input
                    :label="$t('activity.label.name')"
                    v-model="activity.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('activity.validations.nameRequired')
                    ]"
                />

                <q-btn
                    :label="$t('activity.label.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
