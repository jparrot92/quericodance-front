import { WeekDay } from 'src/types/UtilTypes';
import { StudentDTO } from './student.model';
import { TeacherDTO } from './teacher.model';

export interface AbsenceDTO {
    id: number;
    studentId: number;
    activityId: number;
    absenceDate: Date;
}

export interface CourseDTO {
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

export interface CourseListViewDTO extends CourseDTO {
    coursesStudent?: CourseStudentDTO[];
    numberStudents?: string;
    numberLeaders?: string;
    numberFollowers?: string;
    costEffectiveness?: string;
    totalPaid?: string;
}

export interface CourseCountersDTO {
    numberStudents: string;
    numberLeaders: string;
    numberFollowers: string;
    totalPaid: string;
    costEffectiveness: string;
}

export interface CourseViewDTO {
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

export interface CourseStudentDTO {
    id: number;
    danceRole: string;
    price: number;
    course: CourseDTO;
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
