import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} from 'src/api/studentApi';

import { Student } from '../models/student';

const useStudents = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const students = ref<Student[]>([]);
    const student = ref<Student>({
        user: {
            id: 0,
            nif: '',
            name: '',
            surnames: '',
            dateOfBirth: '',
            phone: '',
            photo: '',
            email: '',
            password: '',
            role: '',
            address: {
                street: '',
                city: '',
                state: '',
                postalCode: '',
                country: ''
            }
        },
        nss: ''
    });

    const loadStudents = async () => {
        try {
            students.value = [];
            loading.value = true;
            students.value = await listStudents();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadStudent = async (id: string) => {
        try {
            loading.value = true;
            student.value = await getStudent(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveStudent = async () => {
        try {
            loading.value = true;
            await createStudent(student.value);
            notifySuccess(t('user.notifications.userUpdateSuccessfully'));
            router.push({ name: 'users' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editStudent = async (id: string) => {
        try {
            loading.value = true;
            student.value = await updateStudent(id, student.value);
            notifySuccess(t('user.notifications.userUpdateSuccessfully'));
            router.push({ name: 'users' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeStudent = async (id: string) => {
        $q.dialog({
            title: t('user.label.confirmation'),
            message: t('user.message.userDelete'),
            cancel: true,
            persistent: true
        }).onOk(async () => {
            try {
                await deleteStudent(id);
                notifySuccess(t('user.notifications.userDeleteSuccessfully'));
                await loadStudents();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        students,
        student,
        loadStudents,
        loadStudent,
        saveStudent,
        editStudent,
        removeStudent
    };
};

export default useStudents;
