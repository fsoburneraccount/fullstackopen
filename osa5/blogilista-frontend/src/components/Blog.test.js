import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

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

test('viewing and showing content shows proper fields', () => {
  const component = render(
    <Blog blog={blog} user={user} />
  )

  const title = component.getByText('title blogille', { exact: false })
  const author = component.getByText('authori', { exact: false })
  const url = component.getByText('www.url.com', { exact: false })
  const likes = component.getByText('17', { exact: false })

  expect(title).not.toHaveStyle('display: none')
  expect(author).not.toHaveStyle('display: none')
  expect(url).toHaveStyle('display: none')
  expect(likes).toHaveStyle('display: none')

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(url).not.toHaveStyle('display: none')
  expect(likes).not.toHaveStyle('display: none')
})

test('pressing like twice fires the event handler twice', () => {
  const handleAddLike = jest.fn()

  const component = render(
    <Blog blog={blog} user={user} handleAddLike={handleAddLike} />
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(handleAddLike.mock.calls).toHaveLength(2)
})
