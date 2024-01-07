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
    deleteStudent,
    markPayment,
    cancelPayment
} from 'src/api/studentsApi';

import { Student } from '../models/student';

const useStudents = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const students = ref<Student[]>([]);
    const student = ref<Student>({
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
            active: false,
            roles: []
        },
        monthlyPayment: 0,
        monthlyPaymentPaid: false
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
            student.value = await createStudent(student.value);
            notifySuccess(t('user.notifications.userCreateSuccessfully'));
            router.replace({
                name: 'students-edit',
                params: { id: student.value.id }
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editStudent = async (id: number) => {
        try {
            loading.value = true;
            student.value = await updateStudent(id, student.value);
            notifySuccess(t('user.notifications.userUpdateSuccessfully'));
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

    const markPaymentPaid = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await markPayment(id);
                notifySuccess(t('student.notifications.paymentMade'));
                resolve();
            } catch (error) {
                notifyError(error);
                reject(error);
            }
        });
    };

    const cancelPaymentPaid = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await cancelPayment(id);
                notifySuccess(t('student.notifications.cancelPayment'));
                resolve();
            } catch (error) {
                notifyError(error);
                reject(error);
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
        removeStudent,
        markPaymentPaid,
        cancelPaymentPaid
    };
};

export default useStudents;
