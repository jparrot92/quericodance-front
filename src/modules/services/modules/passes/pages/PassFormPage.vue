<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import usePasses from '../composables/usePasses';

const route = useRoute();

const idPass = computed<string | undefined>(() => route.params.id?.toString());

const { pass, loadPass, savePass, editPass } = usePasses();

const onSubmit = async () => {
    if (idPass.value) {
        editPass(idPass.value);
    } else {
        savePass();
    }
};

onMounted(() => {
    if (idPass.value) {
        loadPass(idPass.value);
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
                <q-input :label="$t('pass.name') + '*'" v-model="pass.name" />

                <q-input
                    type="number"
                    :label="$t('pass.sessions') + '*'"
                    v-model.number="pass.sessions"
                />

                <q-input
                    type="number"
                    :label="$t('pass.price') + '*'"
                    v-model.number="pass.price"
                />

                <pd-editor
                    :label="$t('pass.description') + '*'"
                    v-model="pass.description"
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
