<script setup lang="ts">
import { ref } from 'vue';

import { Status, PaymentsStatus, DanceRole } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import { StudentFilter } from 'src/modules/students/models/student';

const { generateEnumOptions } = useEnumOptions();

const props = withDefaults(
    defineProps<{
        idActivity?: number;
    }>(),
    {}
);

const emit = defineEmits(['filterTable']);

const studentFilter = ref<StudentFilter>({
    textFilter: '',
    status: null,
    paymentStatus: null,
    danceRole: null,
    showProfitability: false,
});

const states = generateEnumOptions(Status);
const paymentStatuses = generateEnumOptions(PaymentsStatus);
const danceRoles = generateEnumOptions(DanceRole);

const initStatus = () => {
    studentFilter.value.status = null;
    emit('filterTable', studentFilter.value);
};

const initPayment = () => {
    studentFilter.value.paymentStatus = null;
    emit('filterTable', studentFilter.value);
};

const initDanceRole = () => {
    studentFilter.value.danceRole = null;
    emit('filterTable', studentFilter.value);
};
</script>

<template>
    <div class="col-12">
        <div class="row">
            <q-input
                class="col-6"
                v-model="studentFilter.textFilter"
                dense
                :label="$t('shared.search')"
                :placeholder="$t('student.label.serachPlaceholder')"
                @update:model-value="emit('filterTable', studentFilter)"
            />
            <q-select
                v-if="!props.idActivity"
                class="q-ml-sm col-2"
                dense
                v-model="studentFilter.status"
                :options="states"
                :label="$t('student.status')"
                @update:model-value="emit('filterTable', studentFilter)"
            >
                <template v-slot:append>
                    <q-icon
                        v-if="studentFilter.status !== null"
                        class="cursor-pointer"
                        name="clear"
                        @click.stop.prevent="initStatus"
                    />
                </template>
            </q-select>
            <q-select
                class="q-ml-sm col-2"
                dense
                v-model="studentFilter.paymentStatus"
                :options="paymentStatuses"
                :label="$t('student.label.paymentStatus')"
                @update:model-value="emit('filterTable', studentFilter)"
            >
                <template v-slot:append>
                    <q-icon
                        v-if="studentFilter.paymentStatus !== null"
                        class="cursor-pointer"
                        name="clear"
                        @click.stop.prevent="initPayment"
                    />
                </template>
            </q-select>
            <q-select
                v-if="props.idActivity"
                class="q-ml-sm col-2"
                dense
                v-model="studentFilter.danceRole"
                :options="danceRoles"
                :label="$t('student.label.role')"
                @update:model-value="emit('filterTable', studentFilter)"
            >
                <template v-slot:append>
                    <q-icon
                        v-if="studentFilter.danceRole !== null"
                        class="cursor-pointer"
                        name="clear"
                        @click.stop.prevent="initDanceRole"
                    />
                </template>
            </q-select>
            <q-toggle
                v-if="props.idActivity"
                class="col-3"
                :label="$t('activity.label.showProfitability')"
                v-model="studentFilter.showProfitability"
                @update:model-value="emit('filterTable', studentFilter)"
            ></q-toggle>
        </div>
    </div>
</template>
