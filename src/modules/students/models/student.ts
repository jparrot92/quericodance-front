import { PaymentsStatus, Option } from 'src/types/UtilTypes';
import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import { User } from 'src/modules/users/models/user';
import { MembershipViewDTO } from './membership';

export interface Student {
    id: number;
    user: User;
    datePayment?: Date;
    observations?: string;
    monthlyPayment: number;
    paymentStatus: PaymentsStatus;
    activitiesStudent?: ActivityStudent[];
    membership: MembershipViewDTO;
    status: string;
}

export interface StudentFilter {
    textFilter: string;
    status?: Option | null;
    paymentStatus: Option | null;
    danceRole?: Option | null;
    showProfitability?: boolean;
}
