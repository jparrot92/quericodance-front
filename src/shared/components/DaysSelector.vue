<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Props {
    day: string;
}

const props = defineProps<Props>();

const selectedDay = ref<string>('');

type Day = {
    label: string;
    value: string;
};

const days: Day[] = [
    { label: t('shared.label.MO'), value: 'MO' },
    { label: t('shared.label.TU'), value: 'TU' },
    { label: t('shared.label.WE'), value: 'WE' },
    { label: t('shared.label.TH'), value: 'TH' },
    { label: t('shared.label.FR'), value: 'FR' },
    { label: t('shared.label.SA'), value: 'SA' },
    { label: t('shared.label.SU'), value: 'SU' }
];

watch(props, () => {
    selectedDay.value = props.day;
});
</script>

<template>
    <q-select
        v-model="selectedDay"
        :options="days"
        :label="$t('shared.label.day')"
    >
        <template v-slot:selected-item="{ opt }" v-if="selectedDay">
            {{ t('shared.label.' + opt) }}
        </template>
        <template v-slot:option="{ itemProps, opt }">
            <q-item v-bind="itemProps">
                <q-item-section>
                    {{ opt.label }}
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>
