import { Todo } from './todo.model';
import { ObjectId } from 'bson';

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
}
