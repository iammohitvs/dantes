import { Executable } from "../executable/index.ts";

export class Loop {
  private wait_time_ms: number;
  private loopId: number | null = null;
  private executable: Executable;
  private params: any[];

  // TODO: create an executable wrapper that makes sure to always check if the
  // loop is currently being run to find a new job, if it is then we dont want
  // it to run again. Use a state to keep track of this (mutex)

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
      this.executable.executeNextJob,
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
