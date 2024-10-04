<script setup lang="ts">
import { computed, defineProps, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useDates from 'src/composables/useDates';

const props = withDefaults(
    defineProps<{
        modelValue: any;
        label: string;
        required?: boolean;
        isPeriod?: boolean;
    }>(),
    {
        required: false,
        isPeriod: false,
    }
);

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

const { convertDateToDDMMYYYY } = useDates();

const dateRef: Ref<any> = ref(null);
const currentView: Ref<string> = ref('Years');

function onUpdateMv2(): void {
    currentView.value = currentView.value === 'Months' ? 'Years' : 'Months';
    if (dateRef.value) {
        dateRef.value.setView(currentView.value);
    }
}

const model = computed({
    get: () =>
        props.isPeriod
            ? props.modelValue
            : convertDateToDDMMYYYY(props.modelValue),
    set: (value: string) => {
        // Convierte la fecha en el formato que necesitas (puedes ajustarlo si quieres almacenar otro formato)
        const isoDate = new Date(
            value.split('/').reverse().join('-') + 'T00:00:00Z'
        ).toISOString();

        emit('update:modelValue', props.isPeriod ? value : isoDate);
    },
});

const locale = {
    /* starting with Sunday */
    days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
        '_'
    ),
    monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dias',
};

function validateDate(value: string): boolean | string {
    if ((props.required && value === '') || value === 'NaN/NaN/NaN') {
        return t('shared.validations.required');
    }
    return true;
}
</script>

<template>
    <template v-if="isPeriod">
        <q-input
            :label="props.label"
            v-model="model"
            mask="##/####"
            :rules="[
                (val: string) => {
                if (props.required && val.length === 0) {
                    return $t('shared.validations.required');
                }
                return true;
                }
            ]"
        >
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                    >
                        <q-date
                            ref="dateRef"
                            v-model="model"
                            default-view="Months"
                            emit-immediately
                            @update:model-value="onUpdateMv2"
                            minimal
                            mask="MM/YYYY"
                        >
                            <div class="row items-center justify-end">
                                <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                />
                            </div>
                        </q-date>
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
    </template>
    <template v-else>
        <q-input
            :label="props.label"
            v-model="model"
            :mask="'##/##/####'"
            :rules="[validateDate]"
        >
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                    >
                        <q-date
                            v-model="model"
                            :locale="locale"
                            mask="DD/MM/YYYY"
                        >
                            <div class="row items-center justify-end">
                                <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                />
                            </div>
                        </q-date>
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
    </template>
</template>
