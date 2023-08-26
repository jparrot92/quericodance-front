<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const StudentList = defineAsyncComponent(
    () => import('src/modules/student/components/student-list/StudentList.vue')
);
</script>

<template>
    <q-page padding>
        <StudentList />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
                v-if="$q.platform.is.mobile"
                fab
                icon="mdi-plus"
                color="primary"
                :to="{ name: 'user-user-form-page' }"
            />
        </q-page-sticky>
    </q-page>
</template>
