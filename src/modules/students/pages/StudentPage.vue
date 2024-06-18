<script setup lang="ts">
import StudentList from '../components/student-list/StudentList.vue';
</script>

<template>
    <q-page padding>
        <student-list />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
                v-if="$q.platform.is.mobile"
                fab
                icon="mdi-plus"
                color="primary"
                :to="{ name: 'students-add' }"
            />
        </q-page-sticky>
    </q-page>
</template>
