import express from 'express';
import { bmiCalculator } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  try {
    const heightNumber = Number(req.query.height);
    const massNumber = Number(req.query.weight);
    if (isNaN(heightNumber) || isNaN(massNumber)) {
        throw new Error('malformatted parameters'); 
    }
    const bmi = bmiCalculator(heightNumber, massNumber);
    res.send({ ...req.query, bmi: bmi });
  } catch (e) {
    res.status(400).send({error : e.message});
  }
});

app.post('/exercises', (req, res) => {
  try {
       if (!req.body || !req.body.daily_exercises || !req.body.target) {
        throw new Error('parameters missing');  
      }
      const trainingAny = req.body.daily_exercises;
      const targetAny = req.body.target;
      const training = trainingAny.map((x: any) => Number(x));
      const target = Number(targetAny);
      const anyNans = training.reduce((acc: any, v: number) => acc || isNaN(v), false);
      if (isNaN(target) || anyNans) {
        throw new Error('malformatted parameters'); 
      } 
      res.send(exerciseCalculator(training, target)); 
  } catch (e) {
      res.status(400).send({error : e.message});
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});