import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import { User } from 'src/modules/users/models/user';
import { MembershipViewDTO } from './membership';
import { ActivityDTO } from 'src/modules/activities/models/activity';
import { BonusStudentDTO } from './bonusStudent';
import { Status } from 'src/types/UtilTypes';

export interface StudentDTO {
    id: number;
    user: User;
    observations?: string;
    status: Status;
    activitiesStudent?: ActivityStudent[];
    bonusesStudent?: BonusStudentDTO[];
    membership?: MembershipViewDTO;
    interestedActivities?: ActivityDTO[];
}
