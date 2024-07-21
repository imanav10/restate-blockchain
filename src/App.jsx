import React from 'react';
import { useEffect, useState } from 'react';
import { ethers ,getAddress} from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

import Navbar from './components/Navbar';
import Search from './components/Search';
import Cards from './components/cards';

import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'
import config from './config.json' 

function App() {
  const [provider, setProvider] = useState(null)
  const [escrow, setEscrow] = useState(null)

  const [account, setAccount] = useState(null)

  const [homes, setHomes] = useState([])
  const [home, setHome] = useState({})
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()

    const realEstate = new ethers.Contract(config[network.chainId].realEstate.address, RealEstate, provider)
    const totalSupply = await realEstate.totalSupply()
    const homes = []

    for (var i = 1; i <= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i)
      const response = await fetch(uri)
      const metadata = await response.json()
      homes.push(metadata)
    }

    setHomes(homes)

    const escrow = new ethers.Contract(config[network.chainId].escrow.address, Escrow, provider)
    setEscrow(escrow)

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const togglePop = (home) => {
    setHome(home)
    toggle ? setToggle(false) : setToggle(true);
  }


  return (
    <>
      <Navbar account={account} setAccount={setAccount} />
      <Search />
      <div className='Cards-section'>
        <p style={{paddingLeft: '10px',fontFamily: 'monospace',fontSize: '22px'}}>Homes for you</p>
        <hr />
        <Cards />
      </div>
    </>
  );
}

export default App;