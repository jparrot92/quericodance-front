import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listDoctors,
    getDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor
} from 'src/api/doctorApi';

import { Doctor } from '../models/doctor';

const useDoctors = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const doctors = ref<Doctor[]>([]);
    const doctor = ref<Doctor>({
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
        speciality: ''
    });

    const loadDoctors = async () => {
        try {
            doctors.value = [];
            loading.value = true;
            doctors.value = await listDoctors();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadDoctor = async (id: string) => {
        try {
            loading.value = true;
            doctor.value = await getDoctor(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveDoctor = async () => {
        try {
            loading.value = true;
            await createDoctor(doctor.value);
            notifySuccess(t('admin.notifications.userUpdateSuccessfully'));
            router.push({ name: 'admin-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editDoctor = async (id: string) => {
        try {
            loading.value = true;
            doctor.value = await updateDoctor(id, doctor.value);
            notifySuccess(t('admin.notifications.userUpdateSuccessfully'));
            router.push({ name: 'admin-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeDoctor = async (id: string) => {
        $q.dialog({
            title: t('admin.label.confirmation'),
            message: t('admin.message.userDelete'),
            cancel: true,
            persistent: true
        }).onOk(async () => {
            try {
                await deleteDoctor(id);
                notifySuccess(t('admin.notifications.userDeleteSuccessfully'));
                await loadDoctors();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        doctors,
        doctor,
        loadDoctors,
        loadDoctor,
        saveDoctor,
        editDoctor,
        removeDoctor
    };
};

export default useDoctors;
