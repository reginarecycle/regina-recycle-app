// import MagnifyingGlass from '../assets/magnifying-glass.svg'

function SearchBar() {
    return (
        <section>
            <div className="search-bar">
                <label>
                    <i className="input-img"></i>
                    <input name="myInput" type="text" placeholder="Search for items (e.g. ‘Milk Container’, ‘Battery’ )" />
                </label>
                <button className="search-button">Search</button>
                <div className='buttons-wrapper'>
                    <div className="buttons">
                        <button className="all-button">All</button>
                        <button className="recyclables-button">Recyclables</button>
                        <button className="hazardous-button">Hazardous</button>
                        <button className="composite-button">Composite</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchBar


