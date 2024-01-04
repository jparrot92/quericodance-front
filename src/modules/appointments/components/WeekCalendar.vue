<template>
    <div class="subcontent">
        <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

        <div class="row justify-center">
            <div
                style="display: flex; width: 100%; height: calc(100vh - 165px)"
            >
                <q-calendar-day
                    ref="calendar"
                    v-model="selectedDate"
                    view="week"
                    locale="es"
                    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
                    :interval-minutes="60"
                    :interval-count="96"
                    :hour24-format="true"
                    :hoverable="true"
                    no-active-date
                    animated
                    bordered
                    transition-next="slide-left"
                    transition-prev="slide-right"
                    @change="onChange"
                    @moved="onMoved"
                    @click-date="onClickDate"
                    @click-time="onClickTime"
                    @click-interval="onClickInterval"
                    @click-head-intervals="onClickHeadIntervals"
                    @click-head-day="onClickHeadDay"
                >
                    <template #head-day-event="{ scope: { timestamp } }">
                        <div
                            style="
                                display: flex;
                                justify-content: center;
                                flex-wrap: wrap;
                                padding: 2px;
                            "
                        >
                            <template
                                v-for="event in eventsMap[timestamp.date]"
                                :key="event.id"
                            >
                                <q-badge
                                    v-if="!event.time"
                                    :class="badgeClasses(event, 'header')"
                                    :style="badgeStyles(event, 'header')"
                                    style="
                                        width: 100%;
                                        cursor: pointer;
                                        height: 12px;
                                        font-size: 10px;
                                        margin: 1px;
                                    "
                                >
                                    <span class="title q-calendar__ellipsis">
                                        {{ event.title }}
                                        <q-tooltip>{{
                                            event.details
                                        }}</q-tooltip>
                                    </span>
                                </q-badge>
                                <q-badge
                                    v-else
                                    :class="badgeClasses(event, 'header')"
                                    :style="badgeStyles(event, 'header')"
                                    style="
                                        margin: 1px;
                                        width: 10px;
                                        max-width: 10px;
                                        height: 10px;
                                        max-height: 10px;
                                    "
                                    @click="scrollToEvent(event)"
                                >
                                    <q-tooltip>{{
                                        event.time + ' - ' + event.title
                                    }}</q-tooltip>
                                </q-badge>
                            </template>
                        </div>
                    </template>

                    <template
                        #day-body="{
                            scope: {
                                timestamp,
                                timeStartPos,
                                timeDurationHeight
                            }
                        }"
                    >
                        <template
                            v-for="event in getEvents(timestamp.date)"
                            :key="event.id"
                        >
                            <div
                                v-if="event.time !== undefined"
                                class="my-event"
                                :class="badgeClasses(event, 'body')"
                                :style="
                                    badgeStyles(
                                        event,
                                        'body',
                                        timeStartPos,
                                        timeDurationHeight
                                    )
                                "
                            >
                                <span class="title q-calendar__ellipsis">
                                    {{ event.title }}
                                    <q-tooltip>{{ event.details }}</q-tooltip>
                                </span>
                            </div>
                        </template>
                    </template>
                </q-calendar-day>
            </div>
        </div>
    </div>
    <AppointmentDialog :is-open="isOpen" @on-close="isOpen = false" />
</template>

<script>
import {
    QCalendarDay,
    addToDate,
    parseTimestamp,
    isBetweenDates,
    today,
    parsed,
    parseDate,
    parseTime
} from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass';

import { defineComponent } from 'vue';
import NavigationBar from '../components/NavigationBar.vue';
import AppointmentDialog from '../components/AppointmentDialog.vue';

// The function below is used to set up our demo data
export default defineComponent({
    name: 'WeekSlotDayBody',
    components: {
        NavigationBar,
        QCalendarDay,
        AppointmentDialog
    },
    data() {
        return {
            selectedDate: today(),
            events: [
                {
                    id: 1,
                    title: 'BACHATA N3',
                    time: '10:00',
                    duration: 60,
                    bgcolor: 'red',
                    day: 'MO'
                },
                {
                    id: 2,
                    title: 'SALASA N3',
                    time: '11:00',
                    duration: 60,
                    bgcolor: 'blue',
                    day: 'MO'
                },
                {
                    id: 3,
                    title: 'SALASA N3',
                    time: '13:00',
                    duration: 60,
                    bgcolor: 'orange',
                    day: 'TU',
                    days: 3
                }
            ],
            eventsMap: {},
            isOpen: false
        };
    },
    methods: {
        // convert the events into a map of lists keyed by date
        loadEventsMap(data) {
            this.events.forEach((event) => {
                const numDay = this.getNumberDay(event.day);

                let eventDate = data.days[numDay].date;

                if (!this.eventsMap[eventDate]) {
                    this.eventsMap[eventDate] = [];
                }

                // Verifica si el evento ya existe en la lista antes de hacer push
                const existingEvent = this.eventsMap[eventDate].find(
                    (existingEvent) => existingEvent.id === event.id
                );

                if (!existingEvent) {
                    this.eventsMap[eventDate].push(event);

                    if (event.days) {
                        let timestamp = parseTimestamp(eventDate);
                        let days = event.days;
                        do {
                            timestamp = addToDate(timestamp, { day: 1 });
                            if (!this.eventsMap[timestamp.date]) {
                                this.eventsMap[timestamp.date] = [];
                            }
                            this.eventsMap[timestamp.date].push(event);
                        } while (--days > 0);
                    }
                }
            });
        },
        getNumberDay(dayOfWeek) {
            switch (dayOfWeek) {
                case 'MO':
                    return 0;
                case 'TU':
                    return 1;
                case 'WE':
                    return 2;
                case 'TH':
                    return 3;
                case 'FR':
                    return 4;
                case 'SA':
                    return 5;
                case 'SU':
                    return 6;
            }
        },
        badgeClasses(event, type) {
            const isHeader = type === 'header';
            return {
                [`text-white bg-${event.bgcolor}`]: true,
                'full-width':
                    !isHeader && (!event.side || event.side === 'full'),
                'left-side': !isHeader && event.side === 'left',
                'right-side': !isHeader && event.side === 'right',
                'rounded-border': true
            };
        },
        badgeStyles(
            event,
            type,
            timeStartPos = undefined,
            timeDurationHeight = undefined
        ) {
            const s = {};
            if (timeStartPos && timeDurationHeight) {
                s.top = timeStartPos(event.time) + 'px';
                s.height = timeDurationHeight(event.duration) + 'px';
            }
            s['align-items'] = 'flex-start';
            return s;
        },
        getEvents(dt) {
            // get all events for the specified date
            const events = this.eventsMap[dt] || [];

            if (events.length === 1) {
                events[0].side = 'full';
            } else if (events.length === 2) {
                // this example does no more than 2 events per day
                // check if the two events overlap and if so, select
                // left or right side alignment to prevent overlap
                const startTime = addToDate(parsed(events[0].date), {
                    minute: parseTime(events[0].time)
                });
                const endTime = addToDate(startTime, {
                    minute: events[0].duration
                });
                const startTime2 = addToDate(parsed(events[1].date), {
                    minute: parseTime(events[1].time)
                });
                const endTime2 = addToDate(startTime2, {
                    minute: events[1].duration
                });
                if (
                    isBetweenDates(startTime2, startTime, endTime, true) ||
                    isBetweenDates(endTime2, startTime, endTime, true)
                ) {
                    events[0].side = 'left';
                    events[1].side = 'right';
                } else {
                    events[0].side = 'full';
                    events[1].side = 'full';
                }
            }

            return events;
        },
        scrollToEvent(event) {
            this.$refs.calendar.scrollToTime(event.time, 350);
        },
        onToday() {
            this.$refs.calendar.moveToToday();
        },
        onPrev() {
            this.$refs.calendar.prev();
        },
        onNext() {
            this.$refs.calendar.next();
        },
        onMoved(data) {
            console.log('onMoved', data);
        },
        onChange(data) {
            console.log('onChange');
            this.loadEventsMap(data);
        },
        onClickDate(data) {
            console.log('onClickDate', data);
        },
        onClickTime(data) {
            this.isOpen = true;
            console.log('onClickTime', data);
        },
        onClickInterval(data) {
            console.log('onClickInterval', data);
        },
        onClickHeadIntervals(data) {
            console.log('onClickHeadIntervals', data);
        },
        onClickHeadDay(data) {
            console.log('onClickHeadDay', data);
        }
    }
});
</script>

<style lang="sass" scoped>
.my-event
  position: absolute
  font-size: 12px
  justify-content: center
  margin: 0 1px
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.full-width
  left: 0
  width: calc(100% - 2px)

.left-side
  left: 0
  width: calc(50% - 3px)

.right-side
  left: 50%
  width: calc(50% - 3px)

.rounded-border
  border-radius: 2px
</style>
