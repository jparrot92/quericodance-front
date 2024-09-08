import { Teacher } from 'src/modules/teachers/models/teacher';
import { ActivityStudent } from './activityStudent';
import { AbsenceDTO } from './absence';

export interface ActivityDTO {
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
    absences?: AbsenceDTO[];
}

export interface ActivityList extends ActivityDTO {
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

export interface ActivityViewDTO {
    id: number;
    name: string;
    level: number | null;
    day: string;
    startHour: string;
    endHour: string;
    numberPlaces: number | null;
    price: number | null;
    color: string;
}
