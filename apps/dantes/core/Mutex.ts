export class Mutex {
  private locked: boolean = false;
  private queue: ((value?: unknown) => void)[] = [];

  constructor() {
    console.log("Mutex created");
  }

  public async activate() {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    }).then(() => {
      this.locked = true;
    });
  }

  public deactivate() {
    if (this.queue.length > 0) {
      const nextActivatee = this.queue.shift();
      if (nextActivatee) nextActivatee();
    } else {
      this.locked = false;
    }
  }
}
