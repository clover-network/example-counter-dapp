import React, { useState } from 'react'
import { Web3ReactProvider, useWeb3React, } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect, useInactiveListener, useContract, useContractCallData } from './hooks'
import { Spinner } from './Spiner'
import { injected } from './connectors'

import CounterContract from './contract_build/Counter.json'

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

function ConnectChain(props) {
  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  const activating = injected === activatingConnector
  const connected = injected === connector
  const disabled = !props.triedEager || !!activatingConnector || !!error

  useInactiveListener(!props.triedEager || !!activatingConnector)

  let isDisconnect = !error && chainId
  const buttonText = isDisconnect ? 'Disconnect' : (activating ? 'Connectting' : 'Connect' )

  return (
    <button
      style={{
        borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
        cursor: disabled ? 'unset' : 'pointer',
        position: 'relative',
      }}
      className="ConnectButton"
      disabled={disabled}
      onClick={() => {
        if (!isDisconnect) {
          setActivatingConnector(injected)
          activate(injected)
        } else {
          deactivate()
        }
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          color: 'black',
          margin: '0 0 0 1rem'
        }}
      >
        {activating && <Spinner color={'red'} style={{ height: '50%', marginLeft: '-1rem' }} />}
      </div>
      { buttonText }
    </button>
  )
}

function App() {
  const triedEager = useEagerConnect()
  const counter = useContract(CounterContract)
  const [loading, setLoading] = useState(false)
  const currentValue = useContractCallData(counter, 'current_value', [])

  const currentValueText = (currentValue === undefined || currentValue === null) ? 'N/A' : currentValue
  const callMethod = async (name) => {
    if (loading) {
      return
    }
    setLoading(true)
    try {
      await counter[name]()
    } catch(ex) {
      console.error('transaction error: ', ex)
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="App">
        <header className="App-header">
          <h1>Counter Example </h1>
          <ConnectChain triedEager={triedEager} />
          <ChainId/>
          <p>
            Current value: {currentValueText}
          </p>

          {loading && <Spinner color={'red'} style={{ height: '40px', marginLeft: '-1rem' }} />}
          <button className="CounterButton" onClick={() => callMethod('inc')}>Inc Counter</button>
          <button className="CounterButton" onClick={() => callMethod('dec')}>Dec Counter</button>
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
