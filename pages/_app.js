import { store, wrapper } from "@/store/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
// persist
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import LoadingScreen from "../components/LoadingScreen";

import { ThemeProvider } from "next-themes";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  // const { store, props } = wrapper.useWrappedStore(rest);
  let persistor = persistStore(store);

  const getLayout = Component.getLayout || ((page) => page);
  return (
    // <ThemeProvider enableSystem={false} attribute="class">
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          {getLayout(<Component {...pageProps} />)}
        </PersistGate>
      </Provider>
    </>
  );
}
