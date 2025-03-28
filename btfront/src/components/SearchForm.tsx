import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { useSearchContext } from './SearchContext';

const SearchForm = () => {
  const {
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    available,
    setAvailable,
    categories,
    onSearch,
  } = useSearchContext();

  return (
    <div className="SearchDiv">
      <div className="divColumn labels">
        <label htmlFor="SearchName">Name</label>
        <label htmlFor="SearchCategory">Category</label>
        <label htmlFor="SearchAvailability">Availability</label>
      </div>
      <div className="divColumn">
        <input
          type="text"
          name="SearchName"
          id="searchName"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MultiSelect
          className="select"
          value={category}
          onChange={(e) => setCategory(e.value)}
          options={categories}
          placeholder="Select a category"
          maxSelectedLabels={3}
        />
        <div className="divRow">
          <select
            name="SearchAvailability"
            className="select"
            id="searchAvailability"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
          >
            <option value="all">All availability</option>
            <option value="true">Available</option>
            <option value="false">Not available</option>
          </select>
          <button onClick={onSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;