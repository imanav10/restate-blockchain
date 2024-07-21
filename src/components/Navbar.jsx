function Navbar({account, setAccount}) {
    const smoothScroll = (e, targetId) => {
        e.preventDefault(); 
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const connecthandler = async () => {
        const accounts = await window.ethereum.request({method : 'eth_requestAccounts'});
        setAccount(accounts[0])
    } 
    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <header>
                <nav>
                    <ul>
                        <li>
                            Buy
                        </li>
                        <li>
                            Sell
                        </li>
                        <li>
                            Rent
                        </li>
                    </ul>
                    <div style={{display:'flex', justifyContent: 'center'}}>
                        🏠 restate.com
                    </div>
                    {account ? (
                            <button type="button" className="button">
                                {account.slice (0,6) + '...' + account.slice(38,42)}
                            </button>
                        ) : (
                            <button type="button" className="button" onClick={connecthandler}>
                                Connect
                            </button>
                        )
                    }
                </nav>
            </header>
        </div> 
      )
}

export default Navbar