<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';

interface Props {
    date: string;
    label: string;
}

interface Emits {
    (e: 'updateDate', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedDate = ref<string>('');

watch(props, () => {
    selectedDate.value = props.date;
});

const updateDate = (value: string) => {
    emit('updateDate', convertISODate(value));
};

const convertISODate = (date: string) => {
    const isoDate = new Date(date);
    const year = isoDate.getFullYear();
    const month = isoDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que debemos sumar 1
    const day = isoDate.getDate();
    const hour = isoDate.getHours();
    const minute = isoDate.getMinutes();
    const second = isoDate.getSeconds();

    const isoString = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}:${second.toString().padStart(2, '0')}.000Z`;

    return isoString;
};

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
    pluralDay: 'dias'
};
</script>

<template>
    <q-input
        :label="label"
        v-model="selectedDate"
        mask="date"
        :rules="['date']"
    >
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                >
                    <q-date
                        v-model="selectedDate"
                        @update:model-value="updateDate"
                        :locale="locale"
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
