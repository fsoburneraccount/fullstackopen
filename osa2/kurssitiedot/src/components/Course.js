import React from 'react'
import Header from './Header'
import Content from './Content'

const CourseStats = ({exercises}) => {
  return (
   <b> total of {exercises.reduce((x,y) => x+y)} exercises </b>
  )
} 

const Course = ({course}) => {
  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <CourseStats exercises={course.parts.map(part => part.exercises)}/>
    </div>
  )
}

export default Course

