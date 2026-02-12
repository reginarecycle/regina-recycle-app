import "./App.css";
import routes from "./routes";
import { RouterProvider } from "react-router-dom";
import AppProvider from "./provider";

function App() {
  return (
    <AppProvider>
      <RouterProvider
        router={routes}
        // fallbackElement={<div className='max-sm:h-dvh h-screen flex items-center justify-center'><div className='text-foreground animate-bounce ' />ReginaRecycle</div>}
      />
    </AppProvider>
  );
}

export default App;
