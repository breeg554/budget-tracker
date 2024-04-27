export class Buildel {
  private baseUrl = "https://api.buildel.ai/api";

  constructor(
    private readonly organizationId: number,
    private readonly pipelineId: number,
    private readonly secret: string
  ) {}

  async createRun() {
    return fetch(
      `${this.baseUrl}/organizations/${this.organizationId}/pipelines/${this.pipelineId}/runs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.secret}`,
        },
      }
    ).then((res) => res.json());
  }

  async startRun(runId: string) {
    return fetch(
      `${this.baseUrl}/organizations/${this.organizationId}/pipelines/${this.pipelineId}/runs/${runId}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.secret}`,
        },
      }
    ).then((res) => res.json());
  }

  async input(runId: string, data: string) {
    return fetch(
      `${this.baseUrl}/organizations/${this.organizationId}/pipelines/${this.pipelineId}/runs/${runId}/input`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.secret}`,
        },
        body: JSON.stringify({
          input_name: "input",
          block_name: "text_input_1",
          data: encodeURIComponent(data),
        }),
      }
    ).then((res) => res.json());
  }
}
