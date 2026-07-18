import { Executable } from "./Executable.ts";

export class Loop {
  private wait_time_ms: number;
  private loopId: number | null = null;
  private executable: Executable;
  private params: any[];

  public isExecuting: boolean = false;

  constructor(
    executable: Executable,
    wait_time_ms: number = Number(process.env.DEFAULT_WAIT_TIME_MS) || 500,
    params: any[]
  ) {
    this.wait_time_ms = wait_time_ms;
    this.executable = executable;
    this.params = params;
  }

  public async executionCore() {
    if (this.isExecuting) return;

    this.isExecuting = true;
    try {
      await this.executable.executeNextJob();
    } finally {
      this.isExecuting = false;
    }
  }

  public startLoop() {
    this.loopId = setInterval(
      () => this.executionCore(),
      this.wait_time_ms,
      ...this.params
    );

    console.log("Loop started");
  }

  public endLoop() {
    if (this.loopId) {
      clearInterval(this.loopId);
      console.log("Loop Ended");
    } else {
      console.log("Loop didnt exist");
    }
  }
}
