export interface MetricsEntry {
  attempts: number;
  success: boolean;
  latencyMs: number;
}

export class MetricsCollector {
  private entries: MetricsEntry[] = [];

  record(entry: MetricsEntry): void {
    this.entries.push(entry);
  }

  summary() {
    const total = this.entries.length;
    if (total === 0) return null;

    const successful = this.entries.filter(e => e.success).length;
    const avgLatency = this.entries.reduce((sum, e) => sum + e.latencyMs, 0) / total;
    const avgAttempts = this.entries.reduce((sum, e) => sum + e.attempts, 0) / total;

    return {
      total,
      successRate: successful / total,
      avgLatencyMs: Math.round(avgLatency),
      avgAttempts: parseFloat(avgAttempts.toFixed(2)),
    };
  }
}