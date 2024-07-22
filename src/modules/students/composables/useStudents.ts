import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { PaymentsStatus, Option } from 'src/types/UtilTypes';

import useNotify from 'src/shared/composables/useNotify';

import {
    listStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    uploadExcel,
    sendMailPayment,
    downloadExcel,
} from 'src/api/studentsApi';

import {
    markPayment,
    cancelPayment,
    resetPaymentsStatus,
} from 'src/api/membershipsApi';

import { StudentDTO } from '../models/student';

const useStudents = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const students = ref<StudentDTO[]>([]);
    const student = ref<StudentDTO>({
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
        status: '',
    });

    const loadStudents = async (idActivity: string) => {
        try {
            students.value = [];
            loading.value = true;
            students.value = await listStudents(idActivity);
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

    const saveStudent = async (data: StudentDTO) => {
        try {
            loading.value = true;
            student.value = await createStudent(data);
            notifySuccess(t('user.notifications.userCreateSuccessfully'));
            router.replace({
                name: 'students-edit',
                params: { id: student.value.id },
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

    const removeStudent = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            $q.dialog({
                title: t('user.label.confirmation'),
                message: t('user.message.userDelete'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteStudent(id);
                    notifySuccess(
                        t('user.notifications.userDeleteSuccessfully')
                    );
                    resolve();
                } catch (error) {
                    notifyError(error);
                    reject(error);
                }
            });
        });
    };

    const markPaymentPaid = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await markPayment(id);
                notifySuccess(t('student.paymentMade'));
                resolve();
            } catch (error) {
                notifyError(error);
                reject(error);
            }
        });
    };

    const sendMailPaymentPaid = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await sendMailPayment(id);
                notifySuccess(t('student.sendMailPaymentPaid'));
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
                notifySuccess(t('student.cancelPayment'));
                resolve();
            } catch (error) {
                notifyError(error);
                reject(error);
            }
        });
    };

    const resetPayments = async () => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                $q.loading.show({
                    message: t('shared.loading'),
                });
                await resetPaymentsStatus();
                notifySuccess(t('shared.notifications.resetPayments'));
                resolve();
            } catch (error) {
                notifyError(error);
                reject(error);
            } finally {
                $q.loading.hide();
            }
        });
    };

    const isPaymentStatusPaid = (status: Option | string): boolean => {
        if (typeof status === 'string') {
            return status === PaymentsStatus.PAYED;
        }

        // Si status es un objeto Option, obtenemos su valor
        const value = status.value;

        // Comparamos el valor con el estado de pago esperado
        return value === PaymentsStatus.PAYED;
    };

    const handleFileUpload = async (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];

        if (
            file &&
            (file.type === 'application/vnd.ms-excel' ||
                file.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.name.endsWith('.xls') ||
                file.name.endsWith('.xlsx'))
        ) {
            try {
                $q.loading.show({
                    message: t('shared.loading'),
                });
                await uploadExcel(file);
                notifySuccess('Excel importado');
                await loadStudents('');
            } catch (error) {
                notifyError(error);
            } finally {
                $q.loading.hide();
            }
        }
    };

    const handleFileDownload = async () => {
        try {
            $q.loading.show({
                message: t('shared.loading'),
            });
            await downloadExcel();
            notifySuccess('Excel descargado');
        } catch (error) {
            notifyError(error);
        } finally {
            $q.loading.hide();
        }
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
        sendMailPaymentPaid,
        cancelPaymentPaid,
        resetPayments,
        isPaymentStatusPaid,
        handleFileUpload,
        handleFileDownload,
    };
};

export default useStudents;
