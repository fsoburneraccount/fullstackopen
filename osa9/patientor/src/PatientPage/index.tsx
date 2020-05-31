import React from "react";
import axios from "axios";
import { Container, Icon, Grid, Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { Modal, Segment } from 'semantic-ui-react';


import { useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Patient, Gender, Entry } from '../types';
import { addPatient, addEntry } from '../state/reducer';
import EntryDefails from './EntryDetails';
import { assertNever } from "../utils";
import AddEntryForm, { EntryFormValues } from './AddEntryForm';

const genderToIcon = (gender: Gender): "mars" | "venus" | "neuter" => {
    switch(gender) {
    case Gender.Male: return 'mars';
    case Gender.Female: return 'venus';
    case Gender.Other: return 'neuter';
    default: return assertNever(gender);
    }
};

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

// wth is a modal
const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new patient</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const patient = patients[id];
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(addPatient(patient));
      } catch (e) {
        console.error(e);
      }
    };
    if (patient && !patient.ssn) {
        fetchPatient();
    }
  }, [dispatch, id, patient]);
  const submitNewEntry = async (values: EntryFormValues, id: Patient['id']) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        { ...values, healthCheckRating: Number(values.healthCheckRating) }
      );
      dispatch(addEntry(id, newEntry));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
    }
  };

  const entries = patient && patient.entries ? patient.entries : [];
  return (
    <div className="App">
      {patient ? 
        <Container>
            <h2>{patient.name}{ patient.gender ? <Icon name={genderToIcon(patient.gender)} size='large'/> : null }</h2>
            <p>ssn: {patient.ssn}</p>
            <p>occupation: {patient.occupation}</p>
            <h3>entries</h3>
            <Grid divided='vertically'>
            { entries.map(entry => ( <EntryDefails key={entry.id} entry={entry} /> )) }
            </Grid>
            <Button onClick={openModal}>Add New Health check</Button>
            <AddEntryModal modalOpen={modalOpen} onClose={closeModal} onSubmit={(ev) => submitNewEntry(ev, id)} error={error} />
        </Container> :
        null
      }
    </div>
  );
};

export default PatientPage;
