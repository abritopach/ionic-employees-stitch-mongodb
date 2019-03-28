import { Frequency } from './frequency.model';

export interface Reminder {
    type: string | '';
    location?: string | '';
    date?: string | '';
    hour?: string | '';
    frequency?: Frequency | '';
}
