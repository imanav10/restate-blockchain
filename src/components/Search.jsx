const Search = () => {
    return(
        <section style={{justifyContent: 'center',display: 'flex',flexDirection: 'column',textAlign: 'center',background: 'url("img2.jpg") center fixed',color: 'white',marginTop: '10px'}} className="search">
            <h2> Search Explore Buy</h2>
            <input type="text" className="search" placeholder="Enter Area, Neighbourhood, City, Country" style={{marginLeft: '10%', marginRight: '10%',marginBottom: '100px'}}>
            </input>
        </section>
    )
}

export default Search