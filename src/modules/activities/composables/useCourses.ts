import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import {
    listCourses,
    getCountersCourse,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    createCourseStudent,
    createCourseAbsence,
    deleteCourseStudent,
    deleteCourseAbsence,
    downloadExcel,
} from 'src/api/coursesApi';
import {
    CourseListViewDTO,
    CourseDTO,
    CourseStudentDTO,
    CourseCountersDTO,
} from 'src/model/activity.model';
import useNotify from 'src/shared/composables/useNotify';

const useCourses = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const courses = ref<CourseListViewDTO[]>([]);
    const course = ref<CourseDTO>({
        id: 0,
        name: '',
        level: null,
        day: null,
        startHour: '',
        endHour: '',
        numberPlaces: null,
        price: null,
        color: '',
        teachersIds: [],
    });
    const courseStudent = ref<CourseStudentDTO>({
        id: 0,
        danceRole: '',
        price: 0,
        course: {
            ...course.value,
        },
    });

    const activityCounters = ref<CourseCountersDTO>({
        numberStudents: '0',
        numberLeaders: '0',
        numberFollowers: '0',
        totalPaid: '0',
        costEffectiveness: '0',
    });

    const loadCourses = async () => {
        try {
            courses.value = [];
            loading.value = true;
            courses.value = await listCourses();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadCountersCourse = async (id: number) => {
        try {
            loading.value = true;
            activityCounters.value = await getCountersCourse(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadCourse = async (id: string) => {
        try {
            loading.value = true;
            course.value = await getCourse(id);

            if (course.value.teachers) {
                course.value.teachersIds =
                    course.value.teachers.map((teacher) => teacher.id) || [];
            }
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveCourse = async () => {
        try {
            loading.value = true;
            course.value = await createCourse(course.value);
            notifySuccess(t('course.messageCourseCreateSuccessfully'));
            router.replace({
                name: 'courses-edit',
                params: { id: course.value.id },
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editCourse = async (id: string) => {
        try {
            loading.value = true;
            course.value = await updateCourse(id, course.value);
            notifySuccess(t('course.messageCourseUpdateSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeCourse = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            $q.dialog({
                title: t('shared.confirmation'),
                message: t('course.messageCourseDelete'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteCourse(id);
                    notifySuccess(t('course.messageCourseDeleteSuccessfully'));
                    resolve();
                } catch (error) {
                    notifyError(error);
                    reject(error);
                }
            });
        });
    };

    const saveCourseStudent = async (
        studentId: number,
        courseId: number,
        danceRole: string
    ) => {
        try {
            const newCourseStudent: CourseStudentDTO =
                await createCourseStudent(studentId, courseId, danceRole);

            return newCourseStudent;
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveCourseAbsence = async (
        studentId: number,
        courseId: number,
        absenceDate: string
    ) => {
        loading.value = true;
        try {
            return await createCourseAbsence(studentId, courseId, absenceDate);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeCourseStudent = async (id: number) => {
        return new Promise<void>((resolve, reject) => {
            $q.dialog({
                title: t('shared.confirmation'),
                message: t('course.messageCourseDelete'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteCourseStudent(id);
                    notifySuccess(t('course.messageCourseDeleteSuccessfully'));
                    resolve(); // Resuelve la promesa después de que todo esté completo
                } catch (error) {
                    notifyError(error);
                    reject(error); // Rechaza la promesa en caso de error
                }
            });
        });
    };

    const removeCourseAbsence = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            $q.dialog({
                title: t('shared.confirmation'),
                message: t('course.removeCourseAbsence'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteCourseAbsence(id);
                    notifySuccess(t('course.absenceDeleteSuccessfully'));
                    resolve();
                } catch (error) {
                    notifyError(error);
                    reject(error);
                }
            });
        });
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
        courses,
        course,
        courseStudent,
        activityCounters,
        loadCourses,
        loadCountersCourse,
        loadCourse,
        saveCourse,
        editCourse,
        removeCourse,
        saveCourseStudent,
        saveCourseAbsence,
        removeCourseStudent,
        removeCourseAbsence,
        handleFileDownload,
    };
};

export default useCourses;
