export const bmiCalculator = (heightInCm: number, massInKg: number): string => {
    const heightInM = heightInCm/100;
    const bmi = massInKg/(heightInM*heightInM);
    if (bmi < 15) {
        return 'Very severely underweight';
    } else if (bmi < 16) {
        return 'Severely underweight';
    } else if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi < 25) {
        return 'Normal (healthy weight)';
    } else if (bmi < 30) {
        return 'Overweight';
    } else if (bmi < 35) {
        return 'Obese Class I (Moderately obese)';
    } else if (bmi < 40) {
        return 'Obese Class I (Severely obese)';
    } else {
        return 'Obese Class III (Very severely obese)';
    }
};

interface NumberTuple {
    value1: number;
    value2: number;
}

const parseBmiArguments = (args: Array<string>): NumberTuple => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');
    const n1 = Number(args[2]);
    const n2 = Number(args[3]);
    if (!isNaN(n1) && !isNaN(n2)) {
        return {
            value1: n1,
            value2: n2
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};


try {
    const { value1, value2 } = parseBmiArguments(process.argv);
    console.log(bmiCalculator(value1, value2));
} catch (e) {
    console.log('Error, something bad happened, message: ', e.message); //eslint-disable-line @typescript-eslint/no-unsafe-member-access
}
