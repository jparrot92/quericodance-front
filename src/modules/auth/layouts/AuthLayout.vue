<script setup lang="ts">
import MenuDrawer from 'src/shared/components/MenuDrawer.vue';
</script>

<template>
    <q-layout view="lHh Lpr lFf">
        <MenuDrawer />

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>
