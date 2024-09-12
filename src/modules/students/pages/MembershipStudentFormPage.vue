<script setup lang="ts">
import { defineProps, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { format } from '@formkit/tempo';
import { useI18n } from 'vue-i18n';

import { PaymentsStatus } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
import { useAuthStore } from '../../auth/store/auth-store';
import useAuth from '../../auth/composables/useAuth';

import useMemberships from 'src/modules/students/composables/useMemberships';
import MembershipDialog from '../components/MembershipDialog.vue';
import { MembershipViewDTO } from '../models/membership';

const emits = defineEmits(['update-membership', 'delete-membership']);

const props = withDefaults(
    defineProps<{
        idStudent: number;
        membership?: MembershipViewDTO;
    }>(),
    {
        membership: () => ({}),
    }
);

const { t } = useI18n();
const router = useRouter();
const { generateEnumOptions } = useEnumOptions();
const { isStudent, isAdmin, refreshInfoStudent } = useAuth();
const authStore = useAuthStore();

const { removeMembership } = useMemberships();

const showModalMembership = ref(false);

const paymentStatuses = generateEnumOptions(PaymentsStatus);

const membership = ref<MembershipViewDTO | null>(props.membership);

const notMembershipText = computed<string>(() =>
    isStudent() ? t('student.notMembershipStudent') : t('student.notMembership')
);

const updateMembership = async (membershipView: MembershipViewDTO) => {
    membership.value = membershipView;
    emits('update-membership', membershipView);
};

const handleDeleteMembership = async () => {
    try {
        if (membership.value?.id) {
            await removeMembership(membership.value.id);
            membership.value = null;
            emits('delete-membership');
        }
    } catch (error) {
        console.error(error);
    }
};

const preventNav = async (event: BeforeUnloadEvent) => {
    await refreshInfoStudent();
    event.preventDefault();
    event.returnValue = '';
};

onMounted(async () => {
    if (isStudent()) {
        window.addEventListener('beforeunload', preventNav);
        membership.value = authStore.user?.student
            ?.membership as MembershipViewDTO;
    }
});

onBeforeUnmount(() => {
    if (isStudent()) {
        window.removeEventListener('beforeunload', preventNav);
    }
});

router.beforeEach(async (to, from, next) => {
    if (isStudent()) {
        await refreshInfoStudent();
        next();
    }
});
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <q-card v-if="membership" flat>
                    <pd-field
                        :label="$t('student.tariff')"
                        :value="
                            membership.tariff?.name +
                            ' - ' +
                            membership.tariff?.price +
                            '€'
                        "
                    />

                    <pd-field
                        :label="$t('student.paymentFrequency')"
                        :value="t('shared.enum.' + membership.paymentFrequency)"
                    />

                    <div class="row">
                        <pd-field
                            class="col-md-3 col-sm-3 col-xs-3 q-pr-md q-pr-sm"
                            :label="$t('student.discountPercentage')"
                            :value="membership.discountPercentage + ' %'"
                        />

                        <pd-field
                            class="col-md-9 col-sm-9 col-xs-9 q-pl-md q-pl-sm"
                            :label="$t('student.discountReason')"
                            :value="membership.discountReason"
                        />
                    </div>

                    <pd-field
                        :label="$t('student.payment')"
                        :value="membership.payment + ' €'"
                    />

                    <pd-select
                        v-model="membership.paymentStatus"
                        :label="$t('student.paymentStatus')"
                        :options="paymentStatuses"
                    />

                    <pd-field
                        :label="$t('student.paymentDate')"
                        :value="
                            membership.paymentDate
                                ? format(membership.paymentDate)
                                : '-'
                        "
                    />

                    <pd-field
                        :label="$t('student.dueDate')"
                        :value="
                            membership.dueDate
                                ? format(membership.dueDate)
                                : '-'
                        "
                    />
                </q-card>

                <q-card flat v-else>
                    <q-banner class="bg-info text-white">
                        {{ notMembershipText }}
                    </q-banner>
                </q-card>
                <q-btn
                    v-if="isAdmin()"
                    :label="
                        membership
                            ? $t('student.editMembership')
                            : $t('student.addMembership')
                    "
                    color="primary"
                    class="full-width"
                    rounded
                    @click="showModalMembership = true"
                />
                <q-btn
                    v-if="isAdmin() && membership"
                    :label="$t('student.deleteMembership')"
                    color="red"
                    class="full-width"
                    rounded
                    @click="handleDeleteMembership"
                />
            </div>
        </div>
    </q-page>

    <membership-dialog
        v-if="showModalMembership"
        :id-student="props.idStudent"
        :membership-student="membership"
        @close="showModalMembership = false"
        @update-membership="updateMembership"
    />
</template>
