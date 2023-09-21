<script setup lang="ts">
import ActivityStudentsList from 'src/modules/activities/components/activity-students-list/ActivityStudentsList.vue';
</script>

<template>
    <q-page padding>
        <ActivityStudentsList />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
                v-if="$q.platform.is.mobile"
                fab
                icon="mdi-plus"
                color="primary"
                :to="{ name: 'activities-add' }"
            />
        </q-page-sticky>
    </q-page>
</template>
