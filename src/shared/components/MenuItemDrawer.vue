<script setup lang="ts">
import { toRef } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useLocalStorageFilters from 'src/composables/useLocalStorageFilters';

export interface ItemMenu {
    title: string;
    icon?: string;
    link?: string;
    level: number;
    children: ItemMenu[];
}

const props = defineProps<{ item: ItemMenu }>();
const item = toRef(props, 'item');

const router = useRouter();
const route = useRoute();
const { removeFiltersFromLocalStorage } = useLocalStorageFilters();

const goToLink = (link?: string) => {
    if (link) {
        removeFiltersFromLocalStorage();
        router.push({ name: link });
    }
};

const isItemSelected = (link?: string) => {
    return route.name === link;
};

const isSubitemSelected = (item: ItemMenu): boolean => {
    if (isItemSelected(item.link)) {
        return true;
    }
    return item.children.some((child) => isSubitemSelected(child));
};
</script>

<template>
    <template v-if="item.children.length === 0">
        <q-item
            :inset-level="item.level"
            clickable
            @click="goToLink(item.link)"
            v-bind:active="isItemSelected(item.link)"
        >
            <q-item-section v-if="item.icon" avatar>
                <q-icon :name="item.icon" />
            </q-item-section>

            <q-item-section>
                <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
        </q-item>
    </template>
    <template v-else>
        <q-expansion-item
            :header-inset-level="item.level"
            :default-opened="isSubitemSelected(item)"
        >
            <template v-slot:header>
                <q-item-section v-if="item.icon" avatar>
                    <q-icon :name="item.icon" />
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ item.title }}</q-item-label>
                </q-item-section>
            </template>
            <MenuItemDrawer
                v-for="child in item.children"
                :key="child.title"
                :item="child"
            />
        </q-expansion-item>
    </template>
</template>
