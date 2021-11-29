import 'tailwindcss/tailwind.css';

import { AppProps } from 'next/app';
import { useEffect } from 'react';
import theme from '@lib/theme';
import { ThemeProvider } from '@material-ui/core';
import NoAutoCompleteBackground from '@components/styled-jsx/NoAutoCompleteBackground';
import Head from 'next/head';
import { UserContext } from '@lib/context';
import { useUser } from '@lib/hooks';
import Connect from '@components/general/tcp/Connect';
import Disconnect from '@components/general/tcp/Disconnect';
import { SnackbarProvider } from 'notistack';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const user = useUser();

  /**
   * Removing the server side injected CSS to make material-ui work with
   * server-side generation
   */
  useEffect(() => document.getElementById('jss-server-side')?.remove());

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <UserContext.Provider value={user}>
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
            />
            <title>Portal de Doações</title>
          </Head>
          <NoAutoCompleteBackground />
          <Component {...pageProps} />
          <Connect />
          <Disconnect />
        </UserContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default MyApp;
