import { User } from 'src/modules/user/models/user';

export interface Teacher {
    user: User;
    speciality: string;
}
