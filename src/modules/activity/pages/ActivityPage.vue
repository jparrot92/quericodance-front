<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const ActivityList = defineAsyncComponent(
    () =>
        import('src/modules/activity/components/activity-list/ActivityList.vue')
);
</script>

<template>
    <q-page padding>
        <ActivityList />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
                v-if="$q.platform.is.mobile"
                fab
                icon="mdi-plus"
                color="primary"
                :to="{ name: 'activities-activity-form-page' }"
            />
        </q-page-sticky>
    </q-page>
</template>
