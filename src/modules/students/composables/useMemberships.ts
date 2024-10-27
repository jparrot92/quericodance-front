import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import {
    listMemberships,
    getMembership,
    createMembership,
    updateMembership,
    deleteMembership,
} from 'src/api/membershipsApi';

import {
    MembershipDTO,
    MembershipViewDTO,
} from 'src/interfaces/student/membership';

import useNotify from 'src/shared/composables/useNotify';

const useMemberships = () => {
    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const memberships = ref<MembershipDTO[]>([]);
    const membership = ref<MembershipDTO>({
        id: 0,
        studentId: 0,
        tariffId: 0,
        paymentFrequency: '',
        discountPercentage: 0,
        discountReason: '',
    });
    const membershipView = ref<MembershipViewDTO>();

    const loadMemberships = async () => {
        try {
            memberships.value = [];
            loading.value = true;
            memberships.value = await listMemberships();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadMembership = async (id: string) => {
        try {
            loading.value = true;
            membership.value = await getMembership(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveMembership = async () => {
        try {
            loading.value = true;
            membershipView.value = await createMembership(membership.value);
            notifySuccess(t('student.membershipCreatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editMembership = async (id: number) => {
        try {
            loading.value = true;
            membershipView.value = await updateMembership(id, membership.value);
            console.log(membershipView.value);
            notifySuccess(t('student.membershipUpdatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeMembership = (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            $q.dialog({
                title: t('shared.confirmation'),
                message: t('student.msgDeleteMembership'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteMembership(id);
                    notifySuccess(t('student.deleteMembershipSuccessfully'));
                    resolve();
                } catch (error) {
                    notifyError(error);
                    reject(error);
                }
            });
        });
    };

    return {
        // Properties
        loading,
        memberships,
        membership,
        membershipView,
        loadMemberships,
        loadMembership,
        saveMembership,
        editMembership,
        removeMembership,
    };
};

export default useMemberships;
