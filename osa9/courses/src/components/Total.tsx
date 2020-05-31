import React from "react";
import { CoursePart } from '../types';

const Total: React.FC<{ courseParts: Array<CoursePart> }> = ({ courseParts }) => (
    <p>
        Number of exercises{" "}
        {courseParts.reduce((acc, part) => acc + part.exerciseCount, 0)}
      </p>
);

export default Total