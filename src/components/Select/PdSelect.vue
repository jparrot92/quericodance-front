<script setup lang="ts">
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        label?: string;
        options: any[] | undefined;
    }>(),
    {}
);

const emit = defineEmits(['update:modelValue']);

const [model] = defineModel();
</script>

<template>
    <q-select
        v-model="model"
        :options="props.options"
        :label="props.label"
        @update:model-value="emit('update:modelValue', $event.value)"
    >
        <template v-slot:selected-item="{ opt }" v-if="model">
            {{ t('shared.enum.' + opt) }}
        </template>
        <template v-slot:option="{ itemProps, opt }">
            <q-item v-bind="itemProps">
                <q-item-section>
                    {{ opt.label }}
                </q-item-section>
            </q-item>
        </template>
        <template v-slot:append>
            <slot name="append"></slot>
        </template>
    </q-select>
</template>
