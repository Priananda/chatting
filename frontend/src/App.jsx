// Entry point utama pada struktur aplikasi 
// tempat semua komponen anak dimuat

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/routes";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  
  return (
    <Provider store={store}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </Provider>
  );
}


export default App;
