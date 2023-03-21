import { printText } from "./utils/helpers";

exports.handler = async (event) => {
  try {
    printText("Hello from Post Confirmation lambda function!");
  } catch (err) {
    console.log("ERROR", err);
  }
};
