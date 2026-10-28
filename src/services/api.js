import axios from "axios";
export const API_ROOT=(process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace(/\/$/,"");
export const api=axios.create({baseURL:API_ROOT});
api.interceptors.request.use(config=>{const token=localStorage.getItem("rb_token");if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
export const imageUrl=(src)=>{if(!src)return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";if(src.startsWith("http"))return src;return API_ROOT.replace(/\/api$/,"")+src;};
