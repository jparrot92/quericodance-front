import { Student } from 'src/modules/students/models/student';
import { Activity } from './activity';

export interface ActivityStudent {
    id: number;
    danceRole: string;
    price: number;
    activity: Activity;
    student?: Student;
}
