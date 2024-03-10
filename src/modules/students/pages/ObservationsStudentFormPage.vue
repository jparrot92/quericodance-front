<script setup lang="ts">
import { watch, defineProps, onMounted } from 'vue';

import useStudents from '../composables/useStudents';
import { Student } from '../models/student';

const { student: newStudent, saveStudent, editStudent } = useStudents();

interface Props {
    student?: Student;
}

const props = defineProps<Props>();

const selectedStudent = newStudent;

watch(props, () => {
    if (props.student !== undefined) {
        selectedStudent.value = props.student;
    }
});

onMounted(() => {
    if (props.student !== undefined) {
        selectedStudent.value = props.student;
    }
});

const onSubmit = async () => {
    if (selectedStudent.value.id) {
        editStudent(selectedStudent.value.id);
    } else {
        saveStudent();
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
                <q-input
                    v-model="selectedStudent.observations"
                    type="textarea"
                />

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
