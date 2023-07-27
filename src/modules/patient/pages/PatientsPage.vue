<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PatientList = defineAsyncComponent(
    () => import('src/modules/patient/components/patient-list/PatientList.vue')
);
</script>

<template>
    <q-page padding>
        <PatientList />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
                v-if="$q.platform.is.mobile"
                fab
                icon="mdi-plus"
                color="primary"
                :to="{ name: 'admin-user-form-page' }"
            />
        </q-page-sticky>
    </q-page>
</template>
