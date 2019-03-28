import { Todo } from './todo.model';
import { ObjectId } from 'bson';
import { Reminder } from './reminder.model';

export interface Note {
    id: number;
    title: string | '';
    todos: Todo[];
    archived: boolean;
    tags: string[] | [];
    pinned: boolean;
    updated_at: Date;
    collaborators: ObjectId[] | [];
    color: string | '#fff';
    reminder: Reminder;
}
