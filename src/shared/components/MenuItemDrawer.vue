<script setup lang="ts">
import { toRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export interface ItemMenu {
    title: string;
    icon?: string;
    link: string;
}

const props = defineProps<{ item: ItemMenu }>();
const item = toRef(props, 'item');

const router = useRouter();
const route = useRoute();

const goToLink = () => {
    if (item.value.link) {
        router.push({ name: item.value.link });
    }
};

const isItemSelected = () => {
    return route.name === item.value.link;
};
</script>

<template>
    <q-item clickable @click="goToLink" v-bind:active="isItemSelected()">
        <q-item-section v-if="item.icon" avatar>
            <q-icon :name="item.icon" />
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
        </q-item-section>
    </q-item>
</template>
