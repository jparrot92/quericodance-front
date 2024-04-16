<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        label?: string;
    }>(),
    {}
);

const emit = defineEmits(['update:modelValue']);

const model = computed({
    get: () => props.modelValue,
    set: (value: string) => {
        emit('update:modelValue', value);
    },
});
</script>

<template>
    <div>
        <div v-if="props.label" class="q-field__label text-caption q-pt-sm">
            {{ props.label }}
        </div>
        <q-editor class="no-margin" v-model="model" />
    </div>
</template>
