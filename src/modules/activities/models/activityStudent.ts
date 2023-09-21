import { Student } from 'src/modules/students/models/student';
import { Activity } from './activity';

export interface ActivityStudent {
    id: number;
    danceRole: string;
    price: 0;
    activity?: Activity;
    student?: Student;
}
