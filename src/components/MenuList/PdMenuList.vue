<script setup lang="ts">
import { computed } from 'vue';
import { Action } from 'src/types/UtilTypes';

const props = defineProps<{
    actions: Action<object>[];
    row: object;
}>();

const filteredActions = computed(() => {
    return props.actions.filter((action) => action.show());
});
</script>

<template>
    <q-btn size="12px" flat dense round icon="more_vert" @click.stop>
        <q-menu>
            <q-list>
                <q-item
                    v-for="(action, index) in filteredActions"
                    :key="index"
                    clickable
                    @click="action.action(props.row)"
                >
                    <q-item-section>
                        {{ action.label }}
                    </q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>
</template>
