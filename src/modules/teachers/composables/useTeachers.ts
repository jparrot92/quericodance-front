import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher
} from 'src/api/teacherApi';

import { Teacher } from '../models/teacher';

const useTeachers = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const teachers = ref<Teacher[]>([]);
    const teacher = ref<Teacher>({
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

    const loadTeachers = async () => {
        try {
            teachers.value = [];
            loading.value = true;
            teachers.value = await listTeachers();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadTeacher = async (id: string) => {
        try {
            loading.value = true;
            teacher.value = await getTeacher(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveTeacher = async () => {
        try {
            loading.value = true;
            await createTeacher(teacher.value);
            notifySuccess(t('user.notifications.userUpdateSuccessfully'));
            router.push({ name: 'users-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editTeacher = async (id: string) => {
        try {
            loading.value = true;
            teacher.value = await updateTeacher(id, teacher.value);
            notifySuccess(t('user.notifications.userUpdateSuccessfully'));
            router.push({ name: 'users-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeTeacher = async (id: string) => {
        $q.dialog({
            title: t('user.label.confirmation'),
            message: t('user.message.userDelete'),
            cancel: true,
            persistent: true
        }).onOk(async () => {
            try {
                await deleteTeacher(id);
                notifySuccess(t('user.notifications.userDeleteSuccessfully'));
                await loadTeachers();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        teachers,
        teacher,
        loadTeachers,
        loadTeacher,
        saveTeacher,
        editTeacher,
        removeTeacher
    };
};

export default useTeachers;
