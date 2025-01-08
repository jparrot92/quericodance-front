import { WeekDay } from 'src/types/UtilTypes';
import { StudentDTO } from './student.model';
import { TeacherDTO } from './teacher.model';

export interface AbsenceDTO {
    id: number;
    studentId: number;
    activityId: number;
    absenceDate: Date;
}

export interface ActivityDTO {
    id: number;
    name: string;
    level: number | null;
    day?: WeekDay | null;
    startHour: string;
    endHour: string;
    numberPlaces: number | null;
    price: number | null;
    color: string;
    teachersIds: number[];
    teachers?: TeacherDTO[];
    absences?: AbsenceDTO[];
}

export interface ActivityListViewDTO extends ActivityDTO {
    activitiesStudent?: ActivityStudentDTO[];
    numberStudents?: string;
    numberLeaders?: string;
    numberFollowers?: string;
    costEffectiveness?: string;
    totalPaid?: string;
}

export interface ActivityCountersDTO {
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

export interface ActivityStudentDTO {
    id: number;
    danceRole: string;
    price: number;
    activity: ActivityDTO;
    student?: StudentDTO;
}

export interface EventDTO {
    id: number;
    name: string;
    dateEvent: Date;
    startHour: string;
    endHour: string;
    color: string;
}
