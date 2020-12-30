import { Web3ReactProvider, useWeb3React, } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect, useInactiveListener } from './hooks'

import './App.css';

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 5000
  return library
}

function ChainId() {
  const { chainId, library } = useWeb3React()

  return (
    <div className="ChainIdWrapper">
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span className="ChainIdText">{chainId ?? 'Not Connected'}</span>
    </div>
  )
}

function App() {
  const triedEager = useEagerConnect()

  return (
      <div className="App">
        <header className="App-header">
          <h1>Counter Example </h1>
          <ChainId/>
          <p>
            Current value: n/a
        </p>
          <button className="CounterButton">Inc Counter</button>
          <button className="CounterButton">Dec Counter</button>
        </header>
      </div>
  );
}


export default function() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  )
}
