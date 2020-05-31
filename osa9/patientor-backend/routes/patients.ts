import express from 'express';
import patientService from '../services/patientService';
import { toNewEntry, toNewPatient, toId } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
  const id = toId(req.params);
  res.send(patientService.getPatient(id));
});

router.post('/', (req, res) => {
  try {
      const newPatient = toNewPatient(req.body);
      const addedPatient = patientService.addPatient(newPatient);
      res.json(addedPatient);
  } catch (e) {
      res.status(400).send(e.message); //eslint-disable-line @typescript-eslint/no-unsafe-member-access
  }
});

router.post('/:id/entries', (req, res) => {
  try {
      const id = toId(req.params);
      const newEntry = toNewEntry(req.body);
      const addedEntry = patientService.addEntry(newEntry, id);
      res.json(addedEntry);
  } catch (e) {
      res.status(400).send(e.message); //eslint-disable-line @typescript-eslint/no-unsafe-member-access
  }
});

export default router;