import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listMemberships,
    getMembership,
    createMembership,
    updateMembership,
    deleteMembership,
} from 'src/api/membershipsApi';

import { MembershipDTO, MembershipViewDTO } from '../models/membership';

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
        membershipActivities: [],
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
            notifySuccess(t('membership.updatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeMembership = async (id: string) => {
        $q.dialog({
            title: t('shared.confirmation'),
            message: t('membership.delete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await deleteMembership(id);
                notifySuccess(t('membership.deleteSuccessfully'));
                await loadMemberships();
            } catch (error) {
                notifyError(error);
            }
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
