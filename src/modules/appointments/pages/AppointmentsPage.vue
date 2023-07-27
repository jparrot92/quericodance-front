<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const WeekCalendar = defineAsyncComponent(
    () => import('src/modules/appointments/components/WeekCalendar.vue')
);
</script>

<template>
    <q-page padding>
        <WeekCalendar />
    </q-page>
</template>
