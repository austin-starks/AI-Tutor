import { AxiosResponse } from "axios";
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";
import _ from "lodash";
import User from "../user";
import {
  Essay,
  FillInTheBlank,
  MultipleChoice,
  QuestionRequest,
  QuestionResponse,
  QuestionTypeEnum,
  ShortAnswer,
  SubjectEnum,
} from "./types";
import QuestionModel from "./schema";
import Balance from "../userBalance";
import dotenv from "dotenv";
dotenv.config();

class Question {
  async sendToModel(
    request: QuestionRequest,
    formattedQuestion: string
  ): Promise<string> {
    console.log("Request: ", formattedQuestion);

    const model = this.getModel(request);
    const temperature = this.getTemperature(request);
    const maxTokens = this.getMaxTokens(request);
    let response: AxiosResponse<CreateCompletionResponse, any> = null;
    let requestAttempts = 0;
    while (!response && requestAttempts < 3) {
      try {
        let answer: string;
        answer =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis nunc vel ante auctor posuere quis sit amet orci. Vestibulum imperdiet ornare dui, quis condimentum purus venenatis volutpat. Vivamus quis convallis metus. Ut turpis urna, ullamcorper aliquet vulputate eget, sagittis in arcu. Curabitur quis enim a justo efficitur hendrerit. Donec vel porttitor turpis. Duis quis aliquet magna, convallis pellentesque nunc. Aliquam turpis leo, elementum nec tempus consequat, rutrum luctus ligula. Integer ut diam eu massa lobortis imperdiet. Duis tortor nibh, cursus ac quam ac, pellentesque tincidunt enim. Fusce id euismod massa, finibus auctor ipsum. Quisque ac fermentum ex. Vestibulum augue turpis, laoreet luctus ultrices non, vehicula sed lacus. Cras imperdiet felis sed consequat viverra. In tristique ac sapien id pretium. Pellentesque maximus vehicula dolor sit amet elementum. Vivamus a commodo dui. Aenean a orci non leo volutpat tristique. Vivamus tristique, nunc in rutrum mattis, neque felis porttitor arcu, ut euismod magna odio non ex. Maecenas hendrerit pellentesque erat, eget laoreet dolor auctor sed. Pellentesque commodo non massa sed facilisis. Suspendisse consectetur tristique commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla facilisi. Aliquam accumsan, augue ut faucibus sodales, enim augue ullamcorper justo, ac aliquam enim dolor eget sem. Morbi semper mi non arcu pulvinar tempus. Phasellus placerat, orci quis fermentum accumsan, neque velit mollis quam, id vehicula nunc elit interdum nunc. Nam feugiat massa non est ornare, malesuada sagittis purus ullamcorper. Aenean in eros ullamcorper, lacinia justo id, imperdiet massa. Sed fringilla dictum scelerisque. Suspendisse viverra tincidunt magna ac congue. Morbi euismod aliquet leo, vitae fringilla massa pulvinar at. Proin dapibus eleifend porttitor. Duis in pretium mauris. Aenean vel ultricies risus. Nullam a feugiat diam, nec congue sapien. Maecenas mollis convallis metus, pulvinar volutpat sem. Praesent porta luctus fringilla. Sed a velit a neque semper ultrices. Sed fringilla semper commodo. Integer sodales facilisis mauris, non rhoncus arcu posuere nec. Etiam fermentum velit orci, et consequat tortor molestie a. Curabitur at purus sit amet sapien luctus tincidunt. In vestibulum purus nec lectus mattis venenatis. Fusce est tortor, maximus ut leo at, ornare fermentum est. Suspendisse dignissim vehicula imperdiet. Pellentesque ut tellus aliquam, volutpat dui ut, sollicitudin nibh. Nam id luctus nisl. Etiam quis risus at risus finibus consectetur. Aenean vitae odio iaculis, sagittis tortor at, fermentum dui. Pellentesque eu efficitur augue, sed sodales dolor. Aenean sit amet magna suscipit, dictum ante vel, feugiat purus. Nam consectetur, felis eget dignissim pharetra, mi ante blandit arcu, quis ullamcorper enim elit a felis. Pellentesque lorem dui, commodo at est id, accumsan mollis magna. Duis dignissim eget diam sed mattis. Aliquam erat volutpat. Vivamus eros dolor, interdum at enim ut, aliquam ornare erat. Maecenas vel gravida lacus. Cras eu tincidunt velit. Curabitur at ligula quis augue posuere sollicitudin ut non tellus. Duis porttitor tellus id turpis tincidunt fermentum. Phasellus ipsum arcu, imperdiet suscipit libero at, rhoncus mattis turpis. Nunc rutrum justo ante, molestie commodo mi pellentesque feugiat. Quisque laoreet turpis sit amet gravida malesuada. Praesent sed ligula ac est.";
        if (process.env.NODE_ENV === "production") {
          const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
          });
          const openai = new OpenAIApi(configuration);
          response = await openai.createCompletion({
            model: model,
            prompt: formattedQuestion,
            max_tokens: maxTokens,
            temperature: temperature,
          });
          console.log("Response: ", response.data.choices);
          answer = response.data.choices[0].text;
        }
        return answer;
      } catch (error) {
        console.log("Error in OpenAI API", error);
        requestAttempts += 1;
      }
    }
    throw new Error("Error in submitting request; please try again later.");
  }

  formatQuestion(question: QuestionRequest) {
    const additionalContext = question.context
      ? `Context: ${question.context}\n\n`
      : "";
    const subjectContext =
      question.subject === SubjectEnum.GENERAL
        ? ""
        : `Subject: ${question.subject}\n\n`;
    return `${additionalContext}${subjectContext}${this.getQuestion(question)}`;
  }

  getQuestion(question: QuestionRequest): string {
    switch (question.questionType) {
      case QuestionTypeEnum.MultipleChoice:
        return this.getMultipleChoiceQuestion(
          question.question as MultipleChoice
        );
      case QuestionTypeEnum.ShortAnswer:
        return this.getShortAnswerQuestion(question.question as ShortAnswer);
      case QuestionTypeEnum.OTHER:
        return this.getOtherQuestion(question.question as ShortAnswer);
      case QuestionTypeEnum.Essay:
        return this.getEssayQuestion(question.question as Essay);
      case QuestionTypeEnum.FillInTheBlank:
        return this.getFillInTheBlankQuestion(
          question.question as FillInTheBlank
        );
    }
  }
  getShortAnswerQuestion(sa: ShortAnswer): string {
    return `The question is: ${sa.question}. The correct answer is `;
  }

  getOtherQuestion(other: ShortAnswer): string {
    return other.question;
  }

  getEssayQuestion(essay: Essay): string {
    let res = `Write an essay. The prompt for the essay is: ${essay.prompt}.`;
    if (essay.wordMin) {
      res += ` The minimum number of words is ${essay.wordMin}.`;
    }
    if (essay.wordMax) {
      res += ` The maximum number of words is ${essay.wordMax}.`;
    }
    return res;
  }

  getFillInTheBlankQuestion(fitb: FillInTheBlank): string {
    // replace consecutive underscores with a single underscore
    const statement = fitb.statement.replace(/_+/g, "_");
    return (
      "Fill in the blanks by replacing _ with the appropiate word. " + statement
    );
  }

  getMultipleChoiceQuestion(question: MultipleChoice) {
    const answerChoices = question.answerChoices.join("\n");
    const alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    for (let i = 0; i < question.answerChoices.length; i++) {
      answerChoices.replace(
        question.answerChoices[i],
        `${alphabet[i]}. ${question.answerChoices[i]}`
      );
    }
    return `The multiple choice question is: ${question.question} The choices are: ${answerChoices}. The correct answer is`;
  }

  getModel(question: QuestionRequest) {
    // text-davinci-003	- most expensive, most accurate
    // text-curie-001 - very capable, but less expensive
    // text-babbage-001 - less capable, but even less expensive
    return "text-davinci-003";
  }

  getTemperature(question: QuestionRequest) {
    switch (question.questionType) {
      case QuestionTypeEnum.MultipleChoice:
        return 0;
      case QuestionTypeEnum.ShortAnswer:
        return 0;
      case QuestionTypeEnum.OTHER:
        return 0.1;
      case QuestionTypeEnum.Essay:
        return 0.2;
      case QuestionTypeEnum.FillInTheBlank:
        return 0;
    }
  }

  getMaxTokens(question: QuestionRequest) {
    switch (question.questionType) {
      case QuestionTypeEnum.MultipleChoice:
        return 1000;
      case QuestionTypeEnum.OTHER:
        return 1000;
      case QuestionTypeEnum.ShortAnswer:
        return 1000;
      case QuestionTypeEnum.FillInTheBlank:
        return 1000;
      case QuestionTypeEnum.Essay:
        return 2000;
    }
  }

  formatResponse(answer: string) {
    return answer.trim();
  }

  async submitFeedback(
    questionId: string,
    userId: string,
    feedback: "good" | "bad"
  ) {
    const question = await QuestionModel.findOne({
      _id: questionId,
      user: userId,
    });
    if (!question) {
      throw new Error("Question not found");
    }
    question.feedback = feedback;
  }

  getCost(questionType: QuestionTypeEnum) {
    switch (questionType) {
      case QuestionTypeEnum.MultipleChoice:
        return 2;
      case QuestionTypeEnum.ShortAnswer:
        return 2;
      case QuestionTypeEnum.OTHER:
        return 5;
      case QuestionTypeEnum.Essay:
        return 5;
      case QuestionTypeEnum.FillInTheBlank:
        return 1;
    }
  }

  async ask(request: QuestionRequest, user: User): Promise<QuestionResponse> {
    this.validate(request);
    // format the question to be sent to the Question
    const formattedQuestion = this.formatQuestion(request);
    const answer = await this.sendToModel(request, formattedQuestion).then(
      (resp) => this.formatResponse(resp)
    );
    const cost = this.getCost(request.questionType);
    // decrement the user's balance
    const newBalance = await Balance.recordTransaction(user, cost);
    // save question/answer to the database
    const model = await QuestionModel.create({
      questionRequest: request,
      question: formattedQuestion,
      answer,
      cost,
      user: user._id,
    });
    return {
      id: model._id,
      answer: model.answer,
      balance: newBalance,
    };
  }

  validate(question: QuestionRequest) {
    if (!question.questionType) {
      throw new Error("Question type is required.");
    }
    this.validateQuestion(question);
  }

  validateQuestion(question: QuestionRequest) {
    if (!question.question) {
      throw new Error("Question is required.");
    }
    switch (question.questionType) {
      case QuestionTypeEnum.MultipleChoice:
        const mc = question.question as MultipleChoice;
        if (!mc.question) {
          throw new Error("Question is required.");
        }
        if (!mc.answerChoices || mc.answerChoices.length < 2) {
          throw new Error(
            "Multiple choice questions must have at least one option."
          );
        }
        if (mc.answerChoices.length > 10) {
          throw new Error(
            "Multiple choice questions must have at most 10 options."
          );
        }
        for (const answer of mc.answerChoices) {
          if (!answer) {
            throw new Error("Answer choices cannot be empty.");
          }
        }
        break;
      case QuestionTypeEnum.Essay:
        const essay = question.question as Essay;
        if (!essay.prompt) {
          throw new Error("Essay prompt is required.");
        }
        const max = essay.wordMax || Number.MAX_SAFE_INTEGER;
        const min = essay.wordMin || 0;
        if (max < min) {
          throw new Error("Word max cannot be less than word min.");
        }
        break;
      case QuestionTypeEnum.FillInTheBlank:
        const fill = question.question as FillInTheBlank;
        if (!fill.statement) {
          throw new Error("Statement is required.");
        }
        const combined = fill.statement.replace(/_+/g, "_");
        const count = (combined.match(/_/g) || []).length;
        if (count === 0) {
          throw new Error("Statement must contain at least one blank.");
        }
        if (count > 5) {
          throw new Error("Statement cannot contain more than 5 blanks.");
        }
        break;
      case QuestionTypeEnum.ShortAnswer:
        const sa = question.question as ShortAnswer;
        if (!sa.question) {
          throw new Error("Question is required.");
        }
        break;
      case QuestionTypeEnum.OTHER:
        if (!question.question) {
          throw new Error("Question is required.");
        }
    }
  }

  public getQuestionCosts() {
    return {
      [QuestionTypeEnum.MultipleChoice]: this.getCost(
        QuestionTypeEnum.MultipleChoice
      ),
      [QuestionTypeEnum.ShortAnswer]: this.getCost(
        QuestionTypeEnum.ShortAnswer
      ),
      [QuestionTypeEnum.OTHER]: this.getCost(QuestionTypeEnum.OTHER),
      [QuestionTypeEnum.Essay]: this.getCost(QuestionTypeEnum.Essay),
      [QuestionTypeEnum.FillInTheBlank]: this.getCost(
        QuestionTypeEnum.FillInTheBlank
      ),
    };
  }
}

export default new Question();
