import { useQuery } from "@tanstack/react-query";

// API endpoint (can be configured via environment variable)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface IsDoctorResponse {
  address: string;
  isDoctor: boolean;
}

/**
 * Check if an address is a doctor by calling the API endpoint
 */
async function checkIsDoctor(address: string | null): Promise<boolean> {
  if (!address) {
    return false;
  }

  const response = await fetch(
    `${API_URL}/api/is-doctor/${encodeURIComponent(address)}`,
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(
      errorData.error ||
        `Failed to check doctor status: ${response.statusText}`,
    );
  }

  const data: IsDoctorResponse = await response.json();
  return data.isDoctor;
}

/**
 * Hook to check if the connected wallet address is registered as a doctor
 *
 * @param address - The Midnight shielded address from the wallet
 * @returns Query result with isDoctor status
 */
export function useIsDoctor(address: string | null) {
  return useQuery({
    queryKey: ["isDoctor", address],
    queryFn: () => checkIsDoctor(address),
    enabled: !!address,
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
}
