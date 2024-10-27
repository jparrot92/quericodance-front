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
<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
