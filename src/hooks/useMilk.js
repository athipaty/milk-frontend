import { useEffect, useState } from "react";
import {
  fetchMilk,
  fetchTodayTotal,
  createMilk,
  deleteMilk,
  updateMilk,   // 👈 add this
} from "../api/milkApi";

export default function useMilk() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const [r, t] = await Promise.all([
        fetchMilk(),
        fetchTodayTotal(),
      ]);
      setRecords(r.data || []);
      setTotal(t.data?.total || 0);
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
    addRecord,
    removeRecord,
    editRecord,
  };
}
