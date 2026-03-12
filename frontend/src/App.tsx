import routes from "./routes";
import { RouterProvider } from "react-router-dom";
import AppProvider from "./provider";
import ReginaRecycleLogo from "@/assets/logoicon.svg?react";
import { Suspense } from "react";

function App() {
  return (
    <AppProvider>

      <Suspense
        fallback={
          <div className="max-sm:h-dvh h-screen flex items-center justify-center">
            <ReginaRecycleLogo className="text-foreground animate-bounce" />
          </div>
        }
      >
        <RouterProvider router={routes} />
      </Suspense>

    </AppProvider>
  );
}

export default App;
