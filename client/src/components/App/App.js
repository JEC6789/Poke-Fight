import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { Battle, EndMenu, HomePage, SelectionScreen, Login, Signup, OpponentSelection } from 'components';


const httpLink = createHttpLink({
  uri: "/graphql"
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export const App = () => {
  const [winner, setWinner] = useState();
  const [mode, setMode] = useState('start');

  useEffect(() => {
    if (mode === 'battle') {
      setWinner(undefined);
    }
  }, [mode]);

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className={styles.main}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/select" element={<SelectionScreen />} />
            <Route path="/opponent" element={<OpponentSelection />} />
            <Route path="/battle" element={
              mode !== "gameOver" ? (
                <Battle
                  onGameEnd={winner => {
                    setWinner(winner);
                    setMode('gameOver');
                  }}
                />
              ) : (mode === "gameOver" && !!winner && (
                <EndMenu winner={winner} onStartClick={() => setMode('battle')} />
              ))
            } />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
};
/*
            {mode === 'start' && (
              <StartMenu onStartClick={() => setMode('homepage')} />
            )}

            {mode === 'homepage' && (
              <HomePage battleClick={() => setMode('SelectionScreen')} />
            )}

            {mode === 'SelectionScreen' && (
              <SelectionScreen characterClick={() => setMode('battle')}/>
            )}

            {mode === 'battle' && (
              <Battle
                onGameEnd={winner => {
                  setWinner(winner);
                  setMode('gameOver');
                }}
              />
            )}

            {mode === 'gameOver' && !!winner && (
              <EndMenu winner={winner} onStartClick={() => setMode('battle')} />
            )}
*/