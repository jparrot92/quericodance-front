import { Status } from 'src/types/UtilTypes';
import { UserDTO } from './user.model';
import { ActivityDTO, ActivityStudentDTO } from './activity.model';
import { BonusDTO } from './bonus.model';
import { MembershipViewDTO } from './finance.model';

export interface StudentDTO {
    id: number;
    user: UserDTO;
    observations?: string;
    status: Status;
    activitiesStudent?: ActivityStudentDTO[];
    bonusesStudent?: BonusStudentDTO[];
    membership?: MembershipViewDTO;
    interestedActivities?: ActivityDTO[];
}

export interface BonusStudentDTO {
    id: number;
    bonus: BonusDTO;
}
