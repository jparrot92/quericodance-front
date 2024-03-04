import { Teacher } from 'src/modules/teachers/models/teacher';
import { ActivityStudent } from './activityStudent';

export interface Activity {
    id: number;
    name: string;
    level: number;
    day: string;
    startHour: string;
    endHour: string;
    numberPlaces: number;
    price: number;
    color: string;
    teachersIds: number[];
    teachers?: Teacher[];
    activitiesStudent?: ActivityStudent[];
    numberStudents?: string;
    numberLeaders?: string;
    numberFollowers?: string;
    costEffectiveness?: string;
}

export interface ActivityFilter {
    textFilter: string;
}
