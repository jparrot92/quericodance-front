<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ActivityListViewDTO } from 'src/model/activity.model';

const props = withDefaults(
    defineProps<{
        activityItem: ActivityListViewDTO;
        showProfitability: boolean;
    }>(),
    {}
);

const { t } = useI18n();
const router = useRouter();

const handleItemClick = (activity: ActivityListViewDTO) => {
    let title = `${t('activity.activity')} ${activity.name} ${
        activity.level
    } - ${t('shared.enum.' + activity.day)} ${activity.startHour}`;

    router.push({
        name: 'activities-list-students',
        params: {
            id: activity.id,
        },
        query: {
            name: title,
        },
    });
};
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple @click="handleItemClick(props.activityItem)">
            <q-item-section>
                <q-item-label lines="1">
                    {{ props.activityItem.name }}
                    {{ props.activityItem.level }}
                    {{ $t('shared.enum.' + props.activityItem.day) }}
                    {{ props.activityItem.startHour }} -
                    {{ props.activityItem.endHour }}
                </q-item-label>
                <q-item-label lines="2">
                    <div class="flex justify-between">
                        <div>
                            {{ $t('activity.numberPlaces') }}
                            {{ props.activityItem.numberPlaces }}
                        </div>
                        <div>
                            {{ $t('activity.numberStudents') }}
                            {{ props.activityItem.numberStudents }}
                        </div>
                    </div>
                </q-item-label>
                <q-item-label lines="3">
                    <div class="flex justify-between">
                        <q-badge
                            color="blue"
                            :label="
                                $t('activity.numberLeaders') +
                                ': ' +
                                props.activityItem.numberLeaders
                            "
                        />
                        <q-badge
                            color="pink"
                            :label="
                                $t('activity.numberFollowers') +
                                ': ' +
                                props.activityItem.numberFollowers
                            "
                        />
                    </div>
                </q-item-label>
                <q-item-label lines="4" v-if="props.showProfitability">
                    <div class="flex justify-between">
                        <q-badge
                            color="green"
                            :label="
                                $t('activity.costEffectiveness') +
                                ': ' +
                                props.activityItem.costEffectiveness +
                                ' €'
                            "
                        />
                        <q-badge
                            color="green"
                            :label="
                                $t('activity.totalPaid') +
                                ': ' +
                                props.activityItem.totalPaid +
                                ' €'
                            "
                        />
                    </div>
                </q-item-label>
            </q-item-section>
            <q-item-section side top>
                <slot name="menu"> </slot>
            </q-item-section>
        </q-item>
        <q-separator />
    </div>
</template>
