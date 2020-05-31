type targetRating = 1 | 2 | 3;

type targetRatingLabel = "BAD" | "OK" | "GOOD";

const getRating = (avgTime: number, target: number): targetRating => {
    if (avgTime >= target) {
        return 3;
    } else if (avgTime >= target*0.75) {
        return 2;
    } else {
        return 1;
    }
};
const getRatingLabel = (rating: targetRating): targetRatingLabel => {
    switch(rating) {
        case 1:
            return "BAD";
        case 2:
            return "OK";
        case 3:
            return "GOOD";
    }
};

interface exerciseResult {
    perdiodLength: number,
    trainingDays: number,
    success: boolean,
    rating: targetRating,
    ratingDescription: targetRatingLabel
    target: number,
    average: number
}

export const exerciseCalculator = (training: Array<number>, target: number): exerciseResult => {
    const nDays = training.length;
    const averageTime = training.reduce((acc, v) => acc+v, 0)/nDays;
    const rating = getRating(averageTime, target);
    const ratingText = getRatingLabel(rating);
    return {
        perdiodLength: nDays,
        trainingDays: training.filter(x => x>0).length,
        success: averageTime>=target,
        rating: rating,
        ratingDescription: ratingText,
        target: target,
        average: averageTime
    };
};

interface targetValues {
    target: number,
    exerciseData: Array<number>
}

const parseArrayOfArguments = (args: Array<string>): targetValues => {
    if (args.length < 4) throw new Error('Not enough arguments');

    const numbers = args.filter((_v, i) => i >= 2).map(x => Number(x));
    const anyNans = numbers.reduce((acc, v) => acc || isNaN(v), false);
    if (!anyNans) {
        return { target: numbers[0],
                 exerciseData: numbers.filter((_v, i) => i>= 1)
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};


try {
    const { target, exerciseData } = parseArrayOfArguments(process.argv);
    console.log(exerciseCalculator(exerciseData, target));
} catch (e) {
    console.log('Error, something bad happened, message: ', e.message); //eslint-disable-line @typescript-eslint/no-unsafe-member-access
}
