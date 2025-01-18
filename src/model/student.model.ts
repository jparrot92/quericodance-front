import { Status } from 'src/types/UtilTypes';
import { UserDTO } from './user.model';
import { CourseDTO, CourseStudentDTO } from './activity.model';
import { BonusDTO } from './bonus.model';
import { MembershipViewDTO } from './finance.model';

export interface StudentDTO {
    id: number;
    user: UserDTO;
    observations?: string;
    status: Status;
    coursesStudent?: CourseStudentDTO[];
    bonusesStudent?: BonusStudentDTO[];
    membership?: MembershipViewDTO;
    interestedActivities?: CourseDTO[];
}

export interface BonusStudentDTO {
    id: number;
    bonus: BonusDTO;
}
