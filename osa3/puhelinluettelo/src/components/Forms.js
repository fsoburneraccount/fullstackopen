import React from 'react'

const FormField = ({fieldLabel, fieldValue, handleChange}) => (
  <div>
    {fieldLabel}: <input value={fieldValue} onChange={handleChange} />
  </div>
)

const InsertForm = ({addValueToList, fields}) => (
  <div>
    <h2>add a new</h2>
    <form onSubmit={addValueToList}>
      {fields.map((field)=><FormField key={field.id}
                                      fieldLabel={field.label}
                                      fieldValue={field.value}
                                      handleChange={field.handleChange} />)}
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
)

const FilterForm = ({nameFilterValue, nameFilterHandleChange}) => (
  <form>
    <FormField fieldLabel="filter shown with"
               fieldValue={nameFilterValue}
               handleChange={nameFilterHandleChange} />
  </form>
)

export default { InsertForm, FilterForm }

