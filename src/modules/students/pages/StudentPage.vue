<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import StudentList from '../components/student-list/StudentList.vue';
import ActivityCounters from '../components/activity-counters/ActivityCounters.vue';

const route = useRoute();

const idActivity = computed<number>(() => Number(route.params.id));
</script>

<template>
    <q-page padding>
        <activity-counters v-if="idActivity" :id-activity="idActivity" />
        <student-list :id-activity="idActivity" />
    </q-page>
</template>
