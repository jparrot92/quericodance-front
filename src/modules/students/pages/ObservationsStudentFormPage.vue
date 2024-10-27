<script setup lang="ts">
import { defineProps } from 'vue';

import { Status } from 'src/types/UtilTypes';

import { StudentDTO } from 'src/interfaces/student/student';

import useStudents from '../composables/useStudents';

const { student: studentForm, editStudent } = useStudents();

const props = withDefaults(
    defineProps<{
        student?: StudentDTO;
    }>(),
    {
        student: () => ({
            id: 0,
            user: {
                id: 0,
                name: '',
                surnames: '',
                dateOfBirth: '',
                phone: '',
                photo: '',
                instagram: '',
                email: '',
                password: '',
                roles: [],
            },
            status: Status.NEW,
        }),
    }
);

studentForm.value = props.student;

const onSubmit = async () => {
    if (studentForm.value.id) {
        editStudent(studentForm.value.id);
    }
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <q-form
                class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
                @submit.prevent="onSubmit"
            >
                <pd-editor v-model="studentForm.observations" />

                <q-btn
                    :label="$t('shared.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
