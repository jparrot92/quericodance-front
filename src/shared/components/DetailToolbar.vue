<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();

// Extraer la clave de route.meta.titleEdit
let titleKey = route.meta.title;
if (route.params.id) {
    titleKey = route.meta.titleEdit;
}

const translatedTitle = computed(() => {
    if (typeof titleKey === 'string') {
        return t(titleKey);
    }
    // Si el tipo de titleKey no es una cadena, puedes proporcionar un valor predeterminado o manejarlo según tus necesidades
    return '';
});
</script>

<template>
    <q-header elevated>
        <q-toolbar>
            <q-btn
                flat
                dense
                round
                icon="arrow_back"
                aria-label="Menu"
                @click="$router.back()"
            />
            <template v-if="route.params.id">
                <q-toolbar-title>
                    {{ translatedTitle }}
                </q-toolbar-title>
            </template>
            <template v-else>
                <q-toolbar-title>
                    {{ translatedTitle }}
                </q-toolbar-title>
            </template>
        </q-toolbar>
    </q-header>
</template>
