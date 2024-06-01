<script setup lang="ts">
import { defineProps } from 'vue';

const props = withDefaults(
    defineProps<{
        label: string;
        value: string;
    }>(),
    {}
);
</script>
<template>
    <q-field :label="props.label" stack-label>
        <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">
                {{ props.value }}
            </div>
        </template>
    </q-field>
</template>
