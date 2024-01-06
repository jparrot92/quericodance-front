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
} from 'src/api/teachersApi';

import { Teacher } from '../models/teacher';

const useTeachers = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const teachers = ref<Teacher[]>([]);
    const teacher = ref<Teacher>({
        id: 0,
        user: {
            id: 0,
            name: 'Karen',
            surnames: 'Cruz',
            dateOfBirth: '2024-01-25T00:00:00.000Z',
            phone: '544534345',
            photo: '',
            instagram: '',
            email: 'karen@gamil.com',
            password: '12345',
            active: false,
            roles: []
        }
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
            teacher.value = await createTeacher(teacher.value);
            notifySuccess(t('teacher.notifications.teacherCreateSuccessfully'));
            router.replace({
                name: 'teachers-edit',
                params: { id: teacher.value.id }
            });
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
            notifySuccess(t('teacher.notifications.teacherUpdateSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeTeacher = async (id: string) => {
        $q.dialog({
            title: t('teacher.label.confirmation'),
            message: t('teacher.message.teacherDelete'),
            cancel: true,
            persistent: true
        }).onOk(async () => {
            try {
                await deleteTeacher(id);
                notifySuccess(
                    t('teacher.notifications.teacherDeleteSuccessfully')
                );
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
