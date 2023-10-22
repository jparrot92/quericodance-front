import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import { User } from 'src/modules/users/models/user';

export interface Student {
    id: number;
    user: User;
    active: boolean;
    monthlyPayment: number;
    monthlyPaymentPaid: boolean;
    activitiesStudent?: ActivityStudent[];
}
