<script setup lang="ts">
import { ActivityType } from 'src/types/UtilTypes';
import ActivityList from '../components/activity-list/ActivityList.vue';
</script>

<template>
    <q-page padding>
        <activity-list :activity-type="ActivityType.EVENT" />
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
