import { Teacher } from 'src/modules/teachers/models/teacher';
import { ActivityStudent } from './activityStudent';

export interface ActivityForm {
    id: number;
    name: string;
    level: number | null;
    day: string;
    startHour: string;
    endHour: string;
    numberPlaces: number | null;
    price: number | null;
    color: string;
    teachersIds: number[];
    teachers?: Teacher[];
}

export interface ActivityList extends ActivityForm {
    activitiesStudent?: ActivityStudent[];
    numberStudents?: string;
    numberLeaders?: string;
    numberFollowers?: string;
    costEffectiveness?: string;
    totalPaid?: string;
}

export interface ActivityCounters {
    numberStudents: string;
    numberLeaders: string;
    numberFollowers: string;
    totalPaid: string;
    costEffectiveness: string;
}

export interface ActivityFilter {
    textFilter: string;
    day: string;
    showProfitability: boolean;
}
