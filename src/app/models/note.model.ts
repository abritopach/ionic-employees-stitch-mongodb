import { Todo } from './todo.model';

export interface Note {
    id: number;
    title: string | '';
    todos: Todo[];
    archived: boolean;
    tags: string[] | [];
}
