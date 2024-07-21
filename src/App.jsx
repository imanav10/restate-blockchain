import React from 'react';
import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import Search from './components/Search';
import Cards from './components/cards';

import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'
import config from './config.json' 
import imgx from './img2.jpg'


const { ethers } = require('ethers');
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
    console.log(homes)

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
        {homes.map((home, index) => (
          <div key = {index}>
            <p style={{paddingLeft: '10px',fontFamily: 'monospace',fontSize: '22px'}}>Homes for you</p>
            <hr />
            <Cards home={home.img} attribute={home.attribute[0].value}/>
            
          </div>
        ))}
        
      </div>
      <Cards home={imgx}/>
    </>
  );
}

export default App;