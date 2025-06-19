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
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data operasi");
  }
};


export default API;
