import React from 'react'

const FormField = ({fieldLabel, fieldValue, handleChange}) => (
  <div>
    {fieldLabel}: <input value={fieldValue} onChange={handleChange} />
  </div>
)

const FilterForm = ({filterLabel, filterValue, filterHandleChange}) => (
  <form>
    <FormField fieldLabel={filterLabel}
               fieldValue={filterValue}
               handleChange={filterHandleChange} />
    </form>
)

export default FilterForm

