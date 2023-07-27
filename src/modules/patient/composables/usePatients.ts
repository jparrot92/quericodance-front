import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient
} from 'src/api/patientApi';

import { Patient } from '../models/patient';

const usePatients = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const patients = ref<Patient[]>([]);
    const patient = ref<Patient>({
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

    const loadPatients = async () => {
        try {
            patients.value = [];
            loading.value = true;
            patients.value = await listPatients();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadPatient = async (id: string) => {
        try {
            loading.value = true;
            patient.value = await getPatient(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const savePatient = async () => {
        try {
            loading.value = true;
            await createPatient(patient.value);
            notifySuccess(t('admin.notifications.userUpdateSuccessfully'));
            router.push({ name: 'admin-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editPatient = async (id: string) => {
        try {
            loading.value = true;
            patient.value = await updatePatient(id, patient.value);
            notifySuccess(t('admin.notifications.userUpdateSuccessfully'));
            router.push({ name: 'admin-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removePatient = async (id: string) => {
        $q.dialog({
            title: t('admin.label.confirmation'),
            message: t('admin.message.userDelete'),
            cancel: true,
            persistent: true
        }).onOk(async () => {
            try {
                await deletePatient(id);
                notifySuccess(t('admin.notifications.userDeleteSuccessfully'));
                await loadPatients();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        patients,
        patient,
        loadPatients,
        loadPatient,
        savePatient,
        editPatient,
        removePatient
    };
};

export default usePatients;
