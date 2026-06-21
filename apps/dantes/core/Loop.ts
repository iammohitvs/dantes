import { Executable } from "./Executable.ts";

export class Loop {
  private wait_time_ms: number;
  private loopId: number | null = null;
  private executable: Executable;
  private params: any[];

  constructor(
    executable: Executable,
    wait_time_ms: number = 500,
    params: any[]
  ) {
    this.wait_time_ms = wait_time_ms;
    this.executable = executable;
    this.params = params;
  }

  public startLoop() {
    this.loopId = setInterval(
      this.executable.executeNextJob.bind(this.executable),
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
