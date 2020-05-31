import patients from '../data/patients';
import { Entry, NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types';

const getPatients = (): Array<NonSensitivePatient> => patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
}));

const getPatient = (id: Patient['id']): Patient | null => {
    const patient = patients.find(p => p.id === id);
    return patient ? patient : null;
};

const addPatient = (newPatient: NewPatient): Patient => {
    const addedPatient = { id: Math.random().toString(), ...newPatient};
    patients.push(addedPatient);
    return addedPatient;
};

const addEntry = (newEntry: NewEntry, patientId: Patient['id']): Entry => {
    const addedEntry = { id: Math.random().toString(), ...newEntry};
    patients.forEach(p => p.id === patientId ? p.entries.push(addedEntry) : p);
    return addedEntry;
};

export default {
    addEntry,
    addPatient,
    getPatient,
    getPatients
};