import { useRef, useState } from "react";
import { getInsurers } from "@/services/insurer";

export const useInsurers = () => {
  const [insurers, setInsurers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  const fetchInsurers = async () => {
    if (hasFetched.current) return;

    try {
      hasFetched.current = true;
      setLoading(true);

      const data = await getInsurers();
      setInsurers(data || []);
    } catch (err) {
      console.error("Failed to fetch insurers:", err);
      hasFetched.current = false; // allow retry if failed
    } finally {
      setLoading(false);
    }
  };

  return {
    insurers,
    loading,
    fetchInsurers,
  };
};