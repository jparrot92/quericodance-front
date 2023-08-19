<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const TeacherList = defineAsyncComponent(
    () => import('src/modules/teacher/components/teacher-list/TeacherList.vue')
);
</script>

<template>
    <q-page padding>
        <TeacherList />
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
