import logo from '../logo.svg';
import { Button, Typography } from "@material-ui/core";
import AnswersReview from "./AnswersReview";
import { useEffect } from "react";

const TotalResults = ({
  classes,
  resetQuiz,
  currentQuizStep,
  processedAnswers,
  setCurrentQuizStep,
}) => {
  useEffect(() => {
    window.scrollTo(0, "20px");
  }, []);
  return currentQuizStep === "results" ? (
    <div className={classes.results}>
      <Typography variant="h1" className={classes.mainTitle}>
        Results
      </Typography>
      <Typography variant="h4">
        {processedAnswers.filter(({ isCorrect }) => isCorrect).length} out of{" "}
        {processedAnswers.length}
      </Typography>
      <Button
        onClick={(e) => {
          setCurrentQuizStep("review");
        }}
        className={classes.submitButton}
        variant="contained"
        color="primary"
      >
        Review your Answers
      </Button>{" "}
      <Button
        onClick={resetQuiz}
        className={classes.submitButton}
        variant="contained"
        color="primary"
      >
        Reset
      </Button>
      <p>Built with React</p>
      <img src={logo} className="App-logo" alt="logo" />
      <p><a href="http://www.michaelogrady.net">Michael O'Grady</a> &copy; 2021</p>
    </div>
  ) : (
    <AnswersReview
      classes={classes}
      resetQuiz={resetQuiz}
      processedAnswers={processedAnswers}
    />
  );
};

export default TotalResults;
