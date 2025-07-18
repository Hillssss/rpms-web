import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// === OPERASI ENDPOINTS ===
export const startOperasi = (data: {
  nama_operasi: string;
  radar: any;
  gunshot: any;
}) => API.post("/api/operasi/mulai", data);

export const connectOperasi = (lat: string, lon: string) =>
  API.post(`/api/operasi/connect?radar_angle=0&radar_lat=${lat}&radar_lon=${lon}&radar_uri=${process.env.NEXT_PUBLIC_API_URL}`);

export const disconnectOperasi = () =>
  API.post("/api/operasi/disconnect");

export const selesaiOperasi = (id_operasi: string) =>
  API.post("/api/operasi/selesai", { id_operasi });

// Tambahkan lainnya jika ada, misalnya:
export const fetchRiwayatOperasi = async () => {
  const response = await API.get("/api/operasi");
  return response.data.data;
};

export const pindahOperasi = (id_operasi: string | number) =>
  API.post(`/api/operasi/pindah?id_operasi=${id_operasi}`);

export const fetchCurrentOperasi = async (id_operasi: number) => {
  try {
    const res = await API.post(`/api/operasi/current?id_operasi=${id_operasi}`);
    return {
      deteksi: res.data.data?.deteksi || [],
      status: res.data.status || 'unknown'
    };
  } catch (error) {
    console.error('Fetch operasi error:', error);
    return { deteksi: [], status: 'error' }; // Struktur konsisten
  }
};

export const fetchKoneksiState = async (): Promise<boolean> => {
  try {
    const res = await API.post("/api/operasi/connect/state");
    return res.data?.data === true;
  } catch (error) {
    console.error("Gagal cek koneksi:", error);
    return false;
  }
};

export const startGunshot = async () => {
  try {
    const res = await API.post("/api/operasi/gunshot/start");
    return res.data.data;
  } catch (error) {
    console.error("Gagal start gunshot:", error);
    throw new Error("Gagal memulai gunshot");
  }
};

export const stopGunshot = async () => {
  try {
    const res = await API.post("/api/operasi/gunshot/stop");
    return res.data.data;
  } catch (error) {
    console.error("Gagal stop gunshot:", error);
    throw new Error("Gagal berhenti gunshot");
  }
};



export default API;
