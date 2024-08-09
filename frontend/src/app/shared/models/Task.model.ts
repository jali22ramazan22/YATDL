export const enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export interface AbstractTask {
    _title: string;
    _dueTo?: Date;
    _priority?: Priority;
    _is_finished?: boolean;
    _whenFinished?: Date | string | undefined;
    _description?: string | undefined;
}


export class Task implements AbstractTask {

    constructor(
        public _title: string,
        public _dueTo: Date,
        public _priority: Priority,
        public _whenFinished?: Date | string | undefined,
        public _description?: string | undefined
    ) {}

    // allocating a new Task instance
    static deepCopy(task: Task): Task {
      return TaskCreator.createTask(
          task._title,
          task._dueTo,
          task._priority,
          task._description
      );
    }
    static bindPriority(val: number): Priority{
      switch(val) {
        case 0:
          return Priority.LOW;
        case 1:
          return Priority.MEDIUM;
        case 2:
          return Priority.HIGH;
      }
      return Priority.LOW;
    }

    finishTask(): void {
        const finishDate = new Date();
        this._whenFinished = finishDate;
    }

    undoFinishTask(): void{
        this._whenFinished = "";
    }

    changePriority(): void{
      switch(this._priority){
        case Priority.HIGH:
          this._priority = Priority.LOW;
          return;
        case Priority.MEDIUM:
          this._priority = Priority.HIGH
          return;
        case Priority.LOW:
          this._priority = Priority.MEDIUM;
      }
    }

    incrementDate(): void{
      this._dueTo.setDate(this._dueTo.getDate() + 1)
      this._dueTo = new Date(this._dueTo.toDateString());
    }
}


export class TaskCreator {
  private static randomName(): string {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 15; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
      }
      return result;
  }

  static createTemplateTask(): Task {
      const title = TaskCreator.randomName();
      const date = new Date();
      return new Task(title, date, Priority.LOW);
  }

  static createTask(title: string, date: string | Date, priority: Priority | number, description?: string): Task {
      if (typeof priority === 'number') {
        priority = Task.bindPriority(priority)
      }
      return new Task(
        title,
        new Date(date),
        priority as Priority,
        undefined,
        description
      );
  }


}
