import { State } from "./state";
import { Patient, Diagnosis, Entry } from "../types";

interface AddedEntryData {
  patientId: Patient['id'];
  entry: Entry;
}

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
    type: "SET_DIAGNOSES";
    payload: Diagnosis[];
  }
  | {
    type: "ADD_ENTRY";
    payload: AddedEntryData;
  };

const addEntryToPatient = (p: Patient, e: Entry): Patient => {
  return { ...p, entries: p.entries.concat(e)};
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_DIAGNOSES":
        return {
          ...state,
          diagnoses: {
            ...action.payload.reduce(
              (acc, diagnosis) => ({ ...acc, [diagnosis.code]: diagnosis }),
              {}
            ),
            ...state.diagnoses
          }
        };
      case "ADD_ENTRY":
        return {
          ...state,
          patients: {
            ...state.patients,
            [action.payload.patientId]: addEntryToPatient(state.patients[action.payload.patientId], action.payload.entry)
          }
        };
    default:
      return state;
  }
};

export const addPatient = (patient: Patient): Action => {
  return { type: "ADD_PATIENT", payload: patient };
};
export const setPatientList = (patientList: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patientList };
};
export const setDiagnoses = (diagnoses: Diagnosis[]): Action => {
  return { type: "SET_DIAGNOSES", payload: diagnoses };
};
export const addEntry = (patientId: Patient['id'], entry: Entry): Action => {
  return { type: "ADD_ENTRY", payload: { patientId, entry }};
}
