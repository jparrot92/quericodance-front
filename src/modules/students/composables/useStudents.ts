import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { PaymentsStatus, Option, Status } from 'src/types/UtilTypes';

import {
    listStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    uploadExcel,
    sendMailPayment,
    downloadExcel,
    downloadTemplateExcel,
} from 'src/api/studentsApi';

import {
    markPayment,
    cancelPayment,
    resetPaymentsStatus,
} from 'src/api/membershipsApi';

import { StudentDTO } from 'src/model/student.model';

import useNotify from 'src/shared/composables/useNotify';
import { PaymentDTO } from 'src/model/finance.model';

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
        status: Status.NEW,
    });
    const uniqueFields = reactive<{
        phone: string;
        email: string;
    }>({
        phone: '',
        email: '',
    });

    const loadStudents = async (idActivity: string | number) => {
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

    const loadStudent = async (id: number) => {
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
            notifySuccess(t('user.messageUserCreateSuccessfully'));
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

            if (uniqueFields.email === student.value.user?.email) {
                delete student.value.user.email;
            }

            if (uniqueFields.phone === student.value.user?.phone) {
                delete student.value.user.phone;
            }

            student.value = await updateStudent(id, student.value);
            notifySuccess(t('user.messageUserUpdateSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeStudent = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            $q.dialog({
                title: t('user.confirmation'),
                message: t('user.messageUserDelete'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteStudent(id);
                    notifySuccess(t('user.messageUserDeleteSuccessfully'));
                    resolve();
                } catch (error) {
                    notifyError(error);
                    reject(error);
                }
            });
        });
    };

    const markPaymentPaid = async (id: number, payment: PaymentDTO) => {
        return new Promise<StudentDTO>(async (resolve, reject) => {
            try {
                const student: StudentDTO = await markPayment(id, payment);
                notifySuccess(t('student.paymentMade'));
                resolve(student);
            } catch (error) {
                notifyError(error);
                reject(error);
            }
        });
    };

    const cancelPaymentPaid = async (id: number) => {
        return new Promise<StudentDTO>(async (resolve, reject) => {
            try {
                const student: StudentDTO = await cancelPayment(id);
                notifySuccess(t('student.cancelPayment'));
                resolve(student);
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

    const isPaymentStatusPaid = (
        status: Option | string | undefined
    ): boolean => {
        if (!status) {
            return false; // O cualquier valor por defecto que prefieras
        }

        if (typeof status === 'string') {
            return status === PaymentsStatus.PAYED;
        }

        // Si status es un objeto Option, obtenemos su valor
        return status.value === PaymentsStatus.PAYED;
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

    const handleFileDownloadTemplate = async () => {
        try {
            $q.loading.show({
                message: t('shared.loading'),
            });
            await downloadTemplateExcel();
            notifySuccess('Excel descargado');
        } catch (error) {
            notifyError(error);
        } finally {
            $q.loading.hide();
        }
    };

    const getStatusColor = (status: Status): string => {
        const statusColorMap: Record<Status, string> = {
            [Status.NEW]: 'blue',
            [Status.ACTIVE]: 'green',
            [Status.INACTIVE]: 'red',
        };
        return statusColorMap[status] || 'grey';
    };

    const getPaymentsStatusColor = (
        status: PaymentsStatus | { value: PaymentsStatus }
    ): string => {
        const statusValue = typeof status === 'string' ? status : status.value;

        const statusColorMap: Record<PaymentsStatus, string> = {
            [PaymentsStatus.PAYED]: 'green',
            [PaymentsStatus.PENDING]: 'red',
        };

        return statusColorMap[statusValue] || 'grey';
    };

    return {
        // Properties
        loading,
        students,
        student,
        uniqueFields,
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
        handleFileDownloadTemplate,
        getStatusColor,
        getPaymentsStatusColor,
    };
};

export default useStudents;
