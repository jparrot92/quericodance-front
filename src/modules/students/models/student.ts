import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import { User } from 'src/modules/users/models/user';
import { MembershipViewDTO } from './membership';
import { ActivityDTO } from 'src/modules/activities/models/activity';

export interface StudentDTO {
    id: number;
    user: User;
    observations?: string;
    status?: string;
    activitiesStudent?: ActivityStudent[];
    membership?: MembershipViewDTO;
    coursesInterest?: ActivityDTO[];
}
