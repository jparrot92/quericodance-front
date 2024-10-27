import { ActivityStudentDTO } from 'src/interfaces/activity/activityStudent';
import { UserDTO } from 'src/interfaces/user/user';
import { MembershipViewDTO } from './membership';
import { ActivityDTO } from 'src/interfaces/activity/activity';
import { BonusStudentDTO } from './bonusStudent';
import { Status } from 'src/types/UtilTypes';

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
