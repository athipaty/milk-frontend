import { useEffect, useState } from "react";
import {
  fetchMilk,
  fetchTodayTotal,
  createMilk,
  deleteMilk,
  updateMilk,
} from "../api/milkApi";

export default function useMilk() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, t] = await Promise.all([fetchMilk(), fetchTodayTotal()]);
      setRecords(r.data || []);
      setTotal(t.data?.total || 0);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const addRecord = async (payload) => {
    await createMilk(payload);
    reload();
  };

  const removeRecord = async (id) => {
    await deleteMilk(id);
    reload();
  };

  const editRecord = async (id, payload) => {
    await updateMilk(id, payload);
    reload();
  };

  return {
    records,
    total,
    loading,
    error,
    addRecord,
    removeRecord,
    editRecord,
  };
}
