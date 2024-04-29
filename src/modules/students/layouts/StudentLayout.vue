<script setup lang="ts">
import MenuDrawer from 'src/shared/components/MenuDrawer.vue';
</script>

<template>
    <q-layout view="hHh Lpr lff">
        <MenuDrawer />

        <q-page-container>
            <router-view v-slot="{ Component }">
                <keep-alive include="StudentPage">
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </q-page-container>
    </q-layout>
</template>
