// rafce
// dont need to import react 
// import React from 'react'
import {
    Grid,
    Paper,
    Select,
    Button,
    MenuItem,
    TextField,
    Container,
    Typography,
    InputLabel,
    FormControl,
    makeStyles
} from "@material-ui/core";
import { useEffect, useState } from "react";
// axios for requests
import axios from "axios";
import QuizAnswers from './QuizAnswers'
import QuizAnswer from "./QuizAnswers";

export const createMarkup = (text) => {
    return { __html: text };
};

export const difficulties = [
    { id: "total_easy_question_count", name: "Easy" },
    { id: "total_medium_question_count", name: "Medium" },
    { id: "total_hard_question_count", name: "Hard" },
];

// const useStyles  - Copied from https://material-ui.com/components/selects/
// now add makeStyles to the import list above
// now add  const classes = useStyles(); to the export default function below - copied also from the above page
// insert your own styles in object below
const useStyles = makeStyles((theme) => ({
    paper: {
        padding: "20px",
        marginTop: "20px",
        barginBottom: "20px",
        borderRadius: "20px",
        boxShadow:
            "0 16px 2px rgba(0,0,0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px"
    },
    mainTitle: {
        fontSize: "45px",
        marginBottom: "20px",
    },
    submitButton: {
        marginTop: "20px",
        borderRadius: "999px",
        background: "#9C27B0",
        "&:hover": {
            backgroundColor: "#9C27B0",
            boxShadow:
                "0 14px 26px -12px rgba(156, 39, 176, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px"
        }
    }
}));


const QuizCategories = () => {
    // useState!
    // functions as required for the API i.e. the user's selected question category, and callback for the category, its an object 
    const [quizData, setQuizData] = useState([])
    const [quizCategories, setQuizCategories] = useState([])

    // Need to define: category, quizNumber, difficulty.

    const [category, setCategory] = useState({});
    // Questions we want to get back
    const [quizNumber, setQuizNumber] = useState(null);
    // Difficulty we want to set
    const [difficulty, setDifficulty] = useState({});
    // Set state
    const [currentQuizStep, setCurrentQuizStep] = useState("start");

    // const [quizData, setQuizData] = useState([]);

    const classes = useStyles();

    const fetchCategories = async () => {
        const { data } = await axios.get(
            `https://opentdb.com/api.php?amount=${quizNumber}&category=${category.id}&difficulty=${difficulty.name.toLowerCase()}`
        );
        // map over each category & callback function
        const formattedData = data.results.map(category => {
            const incorrectAnswersIndexes = category.incorrect_answers.length;
            // random index number, min - 0, max
            const randomIndex = Math.random() * (incorrectAnswersIndexes - 0) + 0;
            // splice - The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
            category.incorrect_answers.splice(
                randomIndex,
                0,
                category.correct_answer
            );
            return {
                // spread everything inside the category object
                ...category,
                // new key called answers , add one element to the array using .concat() - to get all answers, correct and incorrect
                // in order to return new array joining the correct_answer with incorrect_answers
                // new array is called answers
                answers: category.incorrect_answers,
            }
        })
        // console.log({ formattedData });
        setCurrentQuizStep("result");
        setQuizData(formattedData);
    };

    const fetchQuizCategories = async () => {
        const { data } = await axios.get(
            "https://opentdb.com/api_category.php"
        );
        console.log("data ===>>>>>>>", data);
        setQuizCategories(data.trivia_categories);
    }

    useEffect(() => {
        return () => {
            fetchQuizCategories();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!quizData.length && quizNumber && category.id && difficulty.name) {
            fetchCategories();
        }
    };
    const handleSelectChange = (e) => {
        e.preventDefault();
        const selectedCategory = quizCategories.find(
            // From the list of categories, only get the category selected
            (cat) => cat.id === e.target.value
        );
        setCategory(selectedCategory);
    };

    const handleDifficultyChange = (e) => {
        //   Prevent default browser vehaviour
        e.preventDefault();
        const selectedDifficulty = difficulties.find(
            // find the difficulty which matches the selected target value
            (diff) => diff.id === e.target.value
        );
        setDifficulty(selectedDifficulty);
    };

    const handleChange = (e) => {
        e.preventDefault();
        setQuizNumber(e.target.value);
    };


    console.log({ category, difficulty, quizNumber });
    return (
        // <div>Quiz Categories</div>
        // Material-ui component - see https://material-ui.com/components/selects/
        <Container>
            <Paper className={classes.paper}>
                {/* Method to hide initial interface */}
                {currentQuizState === "start"} ?
<>
                    <Typography
                        variant="h1"
                        className={classes.mainTitle}>
                        Get Questions
                </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="category-select-label">
                                        Select Category:
                                </InputLabel>
                                    {/* https://material-ui.com/components/selects/ */}
                                    <Select
                                        required
                                        name="category"
                                        value={category.id || ""}
                                        id="category-select"
                                        label="Select Category"
                                        labelId="category-select-label"
                                        onChange={handleSelectChange}
                                    >
                                        {quizCategories.map((category) => {
                                            <MenuItem key={category.id} value={category.id}>
                                                <span
                                                    dangerouslySetInnerHTML={createMarkup(category.name)}
                                                >
                                                </span>
                                            </MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="difficulty-select-label">
                                        Select Difficulty:
                                </InputLabel>
                                    <Select
                                        required
                                        name={difficulty.id || ""}
                                        id="difficulty-select"
                                        label="Select Difficulty"
                                        labelId="difficulty-select-label"
                                        onChange={handleDifficultyChange}
                                    >
                                        {difficulties.map((difficulty) => {
                                            <MenuItem key={difficulty.id} value={difficulty.id}>
                                                {difficulty.name}
                                            </MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    // Set limit on the amount of questions [ sending request ]
                                    inputProps={{ min: 1, max: 10 }}
                                    required
                                    fullWidth
                                    type="number"
                                    id="quiz-number"
                                    variant="outlined"
                                    name="quiz-number"
                                    label={`Add a quiz number from 1 to 10`}
                                    value={quizNumber || ""}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            className={classes.submitButton}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Submit
                    </Button>
                    </form>
                </>: <QuizAnswers quizData={quizData} />
            </Paper>
        </Container>
    )
}

export default QuizCategories
