<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import useActivities from 'src/modules/activities/composables/useActivities';
import { Activity } from 'src/modules/activities/models/activity';

import { ActivityStudent } from '../models/activityStudent';

const route = useRoute();

const { id } = route.params as { id: string };

const { activities, loadActivities, saveActivityStudent } = useActivities();

interface ActivityStudentItems {
    activityCode: Activity | null;
    role: Role | null;
}

const activityStudentItems = ref<ActivityStudentItems[]>([]);

type Role = {
    label: string;
    value: string;
};

const roles: Role[] = [
    { label: 'Lider', value: 'leader' },
    { label: 'Follower', value: 'follower' }
];

onMounted(() => {
    loadActivities();
    addFirstActivityStudent();
});

const addFirstActivityStudent = () => {
    activityStudentItems.value.push({
        activityCode: null,
        role: null
    });
};

const addActivityStudent = (index: number) => {
    const activityStudentItem = activityStudentItems.value[index];

    const activityStudent = <ActivityStudent>{
        studentId: +id,
        activityId: activityStudentItem.activityCode?.id,
        danceRole: activityStudentItem.role?.value
    };

    saveActivityStudent(activityStudent);

    activityStudentItems.value.push({
        activityCode: null,
        role: null
    });
};

const removeLine = (lineId: number) => {
    if (activityStudentItems.value.length > 1) {
        activityStudentItems.value.splice(lineId, 1);
    }
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <div
                    v-for="(activityStudentItem, index) in activityStudentItems"
                    :key="index"
                >
                    <q-select
                        v-model="activityStudentItem.activityCode"
                        :label="$t('student.label.course')"
                        :options="activities"
                        :option-value="'id'"
                        style="min-width: 250px; max-width: 300px"
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
                        v-model="activityStudentItem.role"
                        :label="$t('student.label.role')"
                        :options="roles"
                        style="min-width: 250px; max-width: 300px"
                    />

                    <div class="q-pa-md q-gutter-sm">
                        <q-btn
                            round
                            color="primary"
                            icon="delete"
                            @click="removeLine(index)"
                        />
                        <q-btn
                            round
                            color="primary"
                            icon="add"
                            @click="addActivityStudent(index)"
                        />
                    </div>
                </div>

                <q-btn
                    :label="$t('user.label.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
