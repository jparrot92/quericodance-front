import { User } from 'src/modules/admin/models/user';

export interface Teacher {
    user: User;
    speciality: string;
}
