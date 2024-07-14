<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();

const titleKey = ref<string>(route.meta.title as string);

const translatedTitle = computed(() => {
    return t(titleKey.value || '');
});

watch(
    () => route.meta.title,
    (newTitle) => {
        if (typeof newTitle === 'string') {
            titleKey.value = newTitle;
        }
    }
);
</script>

<template>
    <q-header>
        <q-toolbar>
            <q-btn
                flat
                dense
                round
                icon="arrow_back"
                aria-label="Menu"
                @click="$router.back()"
            />
            <q-toolbar-title>
                {{ translatedTitle }}
            </q-toolbar-title>
        </q-toolbar>
    </q-header>
</template>
