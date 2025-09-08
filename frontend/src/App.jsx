// Entry point utama pada struktur aplikasi 
// tempat semua komponen anak dimuat

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


export default App;
