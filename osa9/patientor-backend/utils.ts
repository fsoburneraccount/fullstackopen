import { Gender, NewPatient, NewEntry, HealthCheckRating, Diagnose } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const isString = (text: any): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
    return Object.values(Gender).includes(param);
};

const parseString = (field: any, fieldName: string): string => {
    if (!field || !isString(field)) {
        throw new Error('Incorrect of missing ' + fieldName);
    }
    return field; 
};

const parseDate = (date: any): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date');
    }
    return date;
};

const parseGender = (gender: any): Gender => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender');
    } 
    return gender;
};


export const toNewPatient = (obj: any): NewPatient => {
    return {
        name: parseString(obj.name, 'name'),
        dateOfBirth: parseDate(obj.dateOfBirth),
        ssn: parseString(obj.ssn, 'ssn'),
        gender: parseGender(obj.gender),
        occupation: parseString(obj.occupation, 'occupation'),
        entries: []
    };
};

export const toId = (obj: any): string => {
    return parseString(obj.id, 'id');
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating : any): HealthCheckRating => {
    if (!isHealthCheckRating(rating)) {
        throw new Error('Incorrect or missing healthCheckRating');
    } 
    return rating; 
};

const parseEntrytType = (obj: any): 'Hospital' | 'OccupationalHealthcare' | 'HealthCheck' => {
    if (!obj.type) throw new Error('Missing entry type');
    switch(obj.type) {
        case 'Hospital': return 'Hospital';
        case 'OccupationalHealthcare': return 'OccupationalHealthcare';
        case 'HealthCheck': return 'HealthCheck';
        default: throw new Error('Unknown entry type');
    }
};

const parseDiagnosisCodes = (obj: any): Array<Diagnose['code']> => {
    if (!Array.isArray(obj)) throw new Error('diagnosisCodes is not an array');
    const diagnosisCodes = obj.map((dc: any) => parseString(dc, 'diagnosiscode'));
    return diagnosisCodes;
};

export const toNewEntry = (obj: any): NewEntry => {
    const entryType = parseEntrytType(obj);
    
    const baseEntryWithoutDC = {
        description: parseString(obj.description, 'description'),
        date: parseDate(obj.date),
        specialist: parseString(obj.specialist, 'specialist')
    };
    const baseEntry = obj.diagnosisCodes ?
      { ...baseEntryWithoutDC, diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes) } : baseEntryWithoutDC;

    switch (entryType) {
        case 'Hospital':
            return {
                ...baseEntry, type: 'Hospital',
                discharge: {
                    date: parseDate(obj.discharge.date),
                    criteria: parseString(obj.discharge.criteria, "discharge.criteria")
                }
            };
        case 'OccupationalHealthcare':
            return obj.sickLeave ? { 
                ...baseEntry,
                type: 'OccupationalHealthcare', 
                employerName: parseString(obj.employerName, 'employerName'),
                sickLeave: {
                    startDate: parseDate(obj.sickLeave.startDate),
                    endDate: parseDate(obj.sickLeave.endDate)
                }
            } : {
                ...baseEntry,
                type: 'OccupationalHealthcare', 
                employerName: parseString(obj.employerName, 'employerName') 
            };
        case 'HealthCheck':
            return {
                ...baseEntry,
                type: 'HealthCheck', 
                healthCheckRating: parseHealthCheckRating(obj.healthCheckRating)
            };
        default: return assertNever(entryType);
    }
};
