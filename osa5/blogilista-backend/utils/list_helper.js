const totalOf = (arr, of) => arr.reduce((acc,x) => acc + x[of], 0)

const maxBy = (arr, by) => arr.reduce((acc,x) => acc[by]>=x[by] ? acc : x)

const sumBy = (arr, by, value) => {
  const keys = arr.map(x => x[by])
  return keys.filter((k,i) => keys.indexOf(k) === i)
    .map(k => ({
      [by]:  k,
      [value]: totalOf(arr.filter(x => x[by] === k), value)
    }))
}

const summedMaxBy = (arr, by, value) => maxBy(sumBy(arr, by, value), value)

const totalLikes = blogs => totalOf(blogs, 'likes')

const favoriteBlog = blogs => blogs.length===0 ? {} : maxBy(blogs, 'likes')

const mostBlogs = blogs => (
  blogs.length===0 ? {} : summedMaxBy(blogs.map(blog => ({ ...blog, blogs: 1 })), 'author', 'blogs')
)

const mostLikes = blogs => blogs.length===0 ? {} : summedMaxBy(blogs, 'author', 'likes')

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes }

