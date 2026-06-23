/* eslint-disable @typescript-eslint/no-explicit-any */

export const unwrapApiData = <T>(response: any, fallback: T): T => {
  if (!response) return fallback;
  if (Array.isArray(response)) return response as T;
  if (response.data?.data !== undefined) return response.data.data as T;
  if (response.data !== undefined) return response.data as T;
  return response as T;
};

export const normalizeId = (value: any): string => String(value?._id ?? value?.id ?? value ?? "");