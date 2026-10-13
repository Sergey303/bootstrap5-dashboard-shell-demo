import { PrimeReactProvider } from "primereact/api";
import { DemoStoreProvider } from "./app/context";
import { DemoLayout } from "./app/layout";
import { AppRouter } from "./app/router";
import { ThemeRuntime } from "./app/ThemeRuntime";
import "./app/primeLocale";

export default function App() {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <DemoStoreProvider>
        <ThemeRuntime />
        <DemoLayout>
          <AppRouter />
        </DemoLayout>
      </DemoStoreProvider>
    </PrimeReactProvider>
  );
}
