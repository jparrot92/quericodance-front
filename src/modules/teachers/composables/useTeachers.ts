import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import {
    listTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,
} from 'src/api/teachersApi';

import { TeacherDTO } from 'src/interfaces/teacher/teacher';

import useNotify from 'src/shared/composables/useNotify';

const useTeachers = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const teachers = ref<TeacherDTO[]>([]);
    const teacher = ref<TeacherDTO>({
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
            notifySuccess(t('teacher.messageTeacherCreateSuccessfully'));
            router.replace({
                name: 'teachers-edit',
                params: { id: teacher.value.id },
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
            notifySuccess(t('teacher.messageTeacherUpdateSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeTeacher = async (id: number) => {
        $q.dialog({
            title: t('teacher.confirmation'),
            message: t('teacher.message.teacherDelete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await deleteTeacher(id);
                notifySuccess(t('teacher.messageTeacherDeleteSuccessfully'));
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
        removeTeacher,
    };
};

export default useTeachers;
