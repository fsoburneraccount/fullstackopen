import React from "react";
import { Icon, Container, Grid } from "semantic-ui-react";

import { Entry, HealthCheckRating } from '../types';
import { useStateValue } from "../state";
import { assertNever } from "../utils";

const entryToIcon = (entry: Entry): 'hospital' | 'stethoscope' | 'plus square'  => {
    switch(entry.type) {
    case 'Hospital': return 'hospital';
    case 'OccupationalHealthcare': return 'stethoscope';
    case 'HealthCheck': return 'plus square';
    default: return assertNever(entry);
    }
};

const employerData = (entry: Entry): string | null => {
    switch(entry.type) {
        case 'Hospital': return null;
        case 'OccupationalHealthcare': return entry.employerName;
        case 'HealthCheck': return null;
        default: return assertNever(entry);
    } 
};

const DischargeData: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch(entry.type) {
        case 'Hospital': 
            return <div> Discharged at {entry.discharge.date} <br/>Criteria: {entry.discharge.criteria}. </div>;
        case 'OccupationalHealthcare': return null;
        case 'HealthCheck': return null;
        default: return assertNever(entry);
    } 
};

const healthCheckIconColor = (rating: HealthCheckRating): 'green' | 'orange' | 'red' | 'black' => {
    switch(rating) {
        case HealthCheckRating.Healthy: return 'green';
        case HealthCheckRating.LowRisk: return 'orange';
        case HealthCheckRating.HighRisk: return 'red';
        case HealthCheckRating.CriticalRisk: return 'black';
        default: return assertNever(rating); 
    }
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoses }, ] = useStateValue();
  
  return (
    <Grid.Row>
        <Container>
        <h5>{entry.date} <Icon name={entryToIcon(entry)} size='large'/> {employerData(entry)} </h5>
        <p>{entry.description}</p>
        { entry.diagnosisCodes ?
            <ul> 
            {entry.diagnosisCodes.map(dc => (
                <li key={dc}>{dc} {diagnoses[dc].name}</li> 
            ))} 
            </ul> :
            null 
        }
        <DischargeData entry={entry} />
        { entry.type === "HealthCheck" ? <Icon name='heart' color={healthCheckIconColor(entry.healthCheckRating)} /> : null }
        </Container>
    </Grid.Row>
  );
};

export default EntryDetails;
