import {
  findLatestUsdVesRate,
  findRateHistory,
  setLatestUsdVesRate
} from "./rate.repository.js";

export async function getUsdToVesRate(): Promise<{
  provider: string;
  rate: number;
  fetchedAt: string;
  sourceType: "automatic" | "manual";
  note?: string;
}> {
  const row = await findLatestUsdVesRate();
  return {
    provider: row.provider,
    rate: row.value,
    fetchedAt: row.fetchedAt,
    sourceType: row.sourceType,
    note: row.note
  };
}

export async function setManualUsdToVesRate(input: {
  value: number;
  provider?: string;
  note?: string;
}): Promise<{
  provider: string;
  rate: number;
  fetchedAt: string;
  sourceType: "automatic" | "manual";
  note?: string;
}> {
  const row = await setLatestUsdVesRate({
    provider: input.provider ?? "manual",
    value: input.value,
    sourceType: "manual",
    note: input.note
  });

  return {
    provider: row.provider,
    rate: row.value,
    fetchedAt: row.fetchedAt,
    sourceType: row.sourceType,
    note: row.note
  };
}

export async function setAutomaticUsdToVesRate(input: {
  value: number;
  provider: string;
  note?: string;
}): Promise<void> {
  await setLatestUsdVesRate({
    provider: input.provider,
    value: input.value,
    sourceType: "automatic",
    note: input.note
  });
}

export async function getUsdToVesRateHistory(limit = 20): Promise<
  Array<{
    provider: string;
    rate: number;
    fetchedAt: string;
    sourceType: "automatic" | "manual";
    note?: string;
  }>
> {
  const rows = await findRateHistory(limit);
  return rows.map((row) => ({
    provider: row.provider,
    rate: row.value,
    fetchedAt: row.fetchedAt,
    sourceType: row.sourceType,
    note: row.note
  }));
}
