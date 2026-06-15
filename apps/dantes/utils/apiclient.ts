import axios from "axios";

const BASE_CALLBACK_URL = process.env.CALLBACK_URL!;

export const apiClient = axios.create({ baseURL: BASE_CALLBACK_URL });
