import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AppProviders } from "./providers/AppProviders";
import { routeTree } from "./router/-routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
