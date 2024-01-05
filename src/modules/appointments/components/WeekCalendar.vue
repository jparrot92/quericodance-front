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
                                    v-if="!event.startHour"
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
                                        {{ event.name }}
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
                                        event.startHour + ' - ' + event.name
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
                                v-if="event.startHour !== undefined"
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
                                    {{ event.name }}
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
    parseTime
} from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass';

import { listActivities } from 'src/api/activitiesApi';

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
            events: [],
            eventsMap: {},
            isOpen: false
        };
    },
    mounted() {
        this.loadEvents();
    },
    methods: {
        async loadEvents() {
            this.events = await listActivities();

            const currentDate = new Date(); // Puedes pasar la fecha actual como parámetro
            const result = this.generateDateObject(currentDate);

            console.log(JSON.stringify(result, null, 2));

            this.loadEventsMap(result);
        },
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
        calcularDuracionEnMinutos(horaInicio, horaFin) {
            const [horaInicioHoras, horaInicioMinutos] = horaInicio
                .split(':')
                .map(Number);
            const [horaFinHoras, horaFinMinutos] = horaFin
                .split(':')
                .map(Number);

            const minutosInicio = horaInicioHoras * 60 + horaInicioMinutos;
            const minutosFin = horaFinHoras * 60 + horaFinMinutos;

            let duracionEnMinutos = minutosFin - minutosInicio;

            if (duracionEnMinutos < 0) {
                // Si la hora de fin es anterior a la hora de inicio, ajustamos para el día siguiente
                duracionEnMinutos += 24 * 60;
            }

            return duracionEnMinutos;
        },
        badgeClasses(event, type) {
            const isHeader = type === 'header';
            return {
                ['text-white']: true,
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
                const duracionEnMinutos = this.calcularDuracionEnMinutos(
                    event.startHour,
                    event.endHour
                );

                s.top = timeStartPos(event.startHour) + 'px';
                s.height = timeDurationHeight(duracionEnMinutos) + 'px';
            }
            s['align-items'] = 'flex-start';
            s['background-color'] = event.color;
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
        generateDateObject(currentDate) {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(
                currentDate.getDate() -
                    currentDate.getDay() +
                    (currentDate.getDay() === 0 ? -6 : 1)
            );

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const dateObject = {
                start: startOfWeek.toISOString().split('T')[0],
                end: endOfWeek.toISOString().split('T')[0],
                days: []
            };

            for (let i = 0; i < 7; i++) {
                const currentDay = new Date(startOfWeek);
                currentDay.setDate(startOfWeek.getDate() + i);

                const dayObject = {
                    date: currentDay.toISOString().split('T')[0],
                    time: '00:00',
                    year: currentDay.getFullYear(),
                    month: currentDay.getMonth() + 1,
                    day: currentDay.getDate(),
                    hour: 0,
                    minute: 0,
                    weekday: currentDay.getDay(),
                    doy: this.dayOfYear(currentDay),
                    workweek: this.calculateWorkWeek(currentDay),
                    hasDay: true,
                    hasTime: true,
                    past: currentDay < currentDate,
                    current:
                        currentDay.toISOString().split('T')[0] ===
                        currentDate.toISOString().split('T')[0],
                    future: currentDay > currentDate,
                    disabled: false,
                    currentWeekday: currentDay.getDay() === currentDate.getDay()
                };

                dateObject.days.push(dayObject);
            }

            return dateObject;
        },
        dayOfYear(date) {
            const start = new Date(date.getFullYear(), 0, 0);
            const diff = date - start;
            const oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / oneDay);
        },
        calculateWorkWeek(date) {
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            const days = this.dayOfYear(date) + (startOfYear.getDay() || 7);
            return Math.ceil(days / 7);
        },
        scrollToEvent(event) {
            this.$refs.calendar.scrollToTime(event.startHour, 350);
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
