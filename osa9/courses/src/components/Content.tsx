import React from "react";
import { CoursePart } from '../types';
import Part from './Part'

const Content: React.FC<{ courseParts: Array<CoursePart> }> = ({ courseParts }) => (
    <div>
        {courseParts.map(cp => <Part key={cp.name} part={cp}/>)}
    </div>    
);

export default Content