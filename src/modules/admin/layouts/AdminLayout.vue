<script setup lang="ts">
import MenuDrawer from 'components/MenuDrawer.vue';
</script>

<template>
    <q-layout view="hHh Lpr lff">
        <MenuDrawer />

        <q-page-container>
            <router-view> </router-view>
        </q-page-container>
    </q-layout>
</template>
