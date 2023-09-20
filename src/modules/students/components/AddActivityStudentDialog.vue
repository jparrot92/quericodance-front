<script setup lang="ts">
import { watch, onMounted, defineProps, ref } from 'vue';

import useActivities from 'src/modules/activities/composables/useActivities';
import { ActivityStudent } from 'src/modules/activities/models/activityStudent';

interface Props {
    isOpen: boolean;
    idStudent: number;
}
interface Emits {
    (e: 'onClose'): void;
    (e: 'addActivityStudent', activityStudent: ActivityStudent): void;
}
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { activities, activityStudent, loadActivities, saveActivityStudent } =
    useActivities();

const isOpenDialog = ref<boolean>(false);
const idStudentDialog = ref<number>(0);

type Role = {
    label: string;
    value: string;
};

const roles: Role[] = [
    { label: 'Lider', value: 'leader' },
    { label: 'Follower', value: 'follower' }
];

const changePrice = ref<boolean>(false);

const activityId = ref<number>(0);
const danceRole = ref<string>('');
const price = ref<number>(0);

onMounted(() => {
    loadActivities();
});

watch(props, () => {
    isOpenDialog.value = props.isOpen;
    idStudentDialog.value = props.idStudent;
});

const addActivityStudent = async () => {
    activityId.value = activityStudent.value.activity.id;
    danceRole.value = activityStudent.value.danceRole;
    price.value = +activityStudent.value.price;

    const newActivityStudent = await saveActivityStudent(
        idStudentDialog.value,
        activityId.value,
        danceRole.value,
        price.value
    );
    if (newActivityStudent) {
        emits('addActivityStudent', newActivityStudent);
    }
};
</script>

<template>
    <q-dialog v-model="isOpenDialog" @hide="emits('onClose')">
        <q-card>
            <q-card-section>
                <div class="text-h6">{{ $t('student.label.addActivity') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <q-select
                    v-model="activityStudent.activity"
                    :label="$t('student.label.course')"
                    :options="activities"
                    :option-value="'id'"
                >
                    <template v-slot:selected-item="{ opt }">
                        {{
                            opt.name +
                            ' ' +
                            opt.level +
                            ' - ' +
                            opt.day +
                            ' ' +
                            opt.startHour
                        }}
                    </template>
                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                {{
                                    opt.name +
                                    ' ' +
                                    opt.level +
                                    ' - ' +
                                    opt.day +
                                    ' ' +
                                    opt.startHour
                                }}
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <q-select
                    v-model="activityStudent.danceRole"
                    :options="roles"
                    :label="$t('student.label.role')"
                    emit-value
                />

                <q-input
                    type="number"
                    prefix="€"
                    :label="$t('activity.label.price')"
                    v-model="activityStudent.price"
                    :disable="!changePrice"
                    :rules="[
                        (val) =>
                            (val !== null &&
                                val !== undefined &&
                                val.toString().trim() !== '') ||
                            $t('activity.validation.priceRequired')
                    ]"
                />

                <q-checkbox
                    v-model="changePrice"
                    :label="$t('student.label.changePrice')"
                    color="primary"
                />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('student.label.add')"
                    color="primary"
                    @click="addActivityStudent()"
                />
                <q-btn
                    flat
                    :label="$t('student.label.cancel')"
                    color="primary"
                    @click="emits('onClose')"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
