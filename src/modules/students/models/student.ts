import { PaymentsStatus, Option } from 'src/types/UtilTypes';
import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import { User } from 'src/modules/users/models/user';

export interface Student {
    id: number;
    user: User;
    datePayment?: Date;
    observations?: string;
    monthlyPayment: number;
    paymentStatus: PaymentsStatus;
    activitiesStudent?: ActivityStudent[];
}

export interface StudentFilter {
    textFilter: string;
    paymentStatus: Option | null;
    danceRole?: Option | null;
}
