import { User } from 'src/modules/admin/models/user';

export interface Patient {
    user: User;
    nss: string;
}
