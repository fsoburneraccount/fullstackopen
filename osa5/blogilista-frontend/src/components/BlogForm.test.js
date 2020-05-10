import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

const blog = {
  title: 'title blogille',
  author: 'authori',
  url: 'www.url.com',
  likes: 17,
  user: {
    id: 'userid',
    name: 'testi käyttis'
  }
}

const user = { id: 'userid' }

test('pressing like twice fires the event handler twice', () => {
  const addBlog = jest.fn()

  const component = render(
    <BlogForm addBlog={addBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, { target: { value: 'otsikko' } })
  fireEvent.change(author, { target: { value: 'authori' } })
  fireEvent.change(url, { target: { value: 'urli' } })
  fireEvent.submit(form)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toBe('otsikko')
  expect(addBlog.mock.calls[0][1]).toBe('authori')
  expect(addBlog.mock.calls[0][2]).toBe('urli')
})

