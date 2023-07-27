import { User } from 'src/modules/admin/models/user';

export interface Doctor {
    user: User;
    speciality: string;
}
