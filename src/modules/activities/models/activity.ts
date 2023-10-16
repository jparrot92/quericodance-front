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
    fullName: string;
    activitiesStudent?: ActivityStudent[];
    numberStudents?: string;
    numberLeaders?: string;
    numberFollowers?: string;
    costEffectiveness?: string;
}
