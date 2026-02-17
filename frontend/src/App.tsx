import "./App.css";
import routes from "./routes";
import { RouterProvider } from "react-router-dom";
import AppProvider from "./provider";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={routes} />
    </AppProvider>
  );
}

export default App;
