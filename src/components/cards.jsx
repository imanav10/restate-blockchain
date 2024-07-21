import imgx from '../img2.jpg'
function Cards({home, attribute}) {
    const disattribute = attribute || '9'
    return(
        <div style={{color: 'white'}} className="cards">
            <div className="card">
                <div className="card_image">
                    <img src={home} />
                </div>
                <div className="card_info">
                    <h4 >{disattribute} ETH </h4>
                    <p>
                        <strong>3</strong> bds |
                        <strong>4</strong> ba |
                        <strong>323</strong> sqft
                    </p>
                    <p>South kailash, New Delhi</p>
                </div>
            </div>
        </div>
        
    )
}

export default Cards;