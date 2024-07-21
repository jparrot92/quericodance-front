import { StudentDTO } from 'src/modules/students/models/student';
import { ActivityDTO } from './activity';

export interface ActivityStudent {
    id: number;
    danceRole: string;
    price: number;
    activity: ActivityDTO;
    student?: StudentDTO;
}
