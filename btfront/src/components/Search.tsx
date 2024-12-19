import React from 'react'

function Search() {
  return (
    <div className='SearchDiv'>
        <div className='divColumn labels'>
            <label htmlFor="SearchName">Name 
            </label>
            <label htmlFor="SearchCategory"> Category
            </label>
            <label htmlFor="SearchAvailability"> Availability
            </label>
        </div>
        <div className='divColumn'>
            <input type="text" name='SearchName' id='searchName'/>
            <select name="SearchCategory" id="searchCategory">
                <option value="1">Ejemplo1</option>
                <option value="2">Ejemplo2</option>
            </select>
            <div className='divRow'>
                <select name="SearchAvailability" id="searchAvailability">
                    <option value="1">Ejemplo1</option>
                    <option value="2">Ejemplo2</option>
                </select>
                <button>Search</button>
            </div>
            
        </div>

    </div>
  )
}

export default Search
