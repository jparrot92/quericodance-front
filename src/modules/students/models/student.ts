import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import { User } from 'src/modules/users/models/user';
import { MembershipViewDTO } from './membership';

export interface Student {
    id: number;
    user: User;
    observations?: string;
    status?: string;
    activitiesStudent?: ActivityStudent[];
    membership?: MembershipViewDTO;
}
