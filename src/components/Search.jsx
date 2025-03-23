import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className='search'>
            <div>
                <img src='search.svg' alt='search' />
                <input
                    type='text'
                    placeholder='Search the movie'
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
            {/* <h2 className='text-white text-3xl'>{searchTerm}</h2> */}
        </div>
    )
}

export default Search