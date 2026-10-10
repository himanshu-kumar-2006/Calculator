       const input = document.getElementById("inputbox");
        const buttons = document.querySelectorAll("button");

        let expression = "";

        const operators = ["+", "-", "*", "/"];

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                const value = button.dataset.value;

                // AC
                if (value === "AC") {
                    expression = "";
                    input.value = "";
                    return;
                }

                // DELETE
                if (value === "DEL") {
                    expression = expression.slice(0, -1);
                    input.value = expression;
                    return;
                }

                // EQUAL
                if (value === "=") {
                    calculate();
                    return;
                }

                // PERCENTAGE
                if (value === "%") {

                    if (expression === "") return;

                    try {
                        const number = parseFloat(expression);
                        expression = String(number / 100);
                        input.value = expression;
                    } catch {
                        input.value = "Error";
                        expression = "";
                    }

                    return;
                }

                // Prevent multiple operators
                if (operators.includes(value)) {

                    if (expression === "") {
                        if (value !== "-") return;
                    }

                    const lastCharacter =
                        expression.charAt(expression.length - 1);

                    if (operators.includes(lastCharacter)) {
                        expression =
                            expression.slice(0, -1) + value;
                    } else {
                        expression += value;
                    }

                    input.value = expression;
                    return;
                }

                // Prevent multiple decimal points
                if (value === ".") {

                    const parts = expression.split(/[\+\-\*\/]/);
                    const currentNumber = parts[parts.length - 1];

                    if (currentNumber.includes(".")) {
                        return;
                    }
                }

                expression += value;
                input.value = expression;

            });

        });


        function calculate() {

            if (expression === "") return;

            try {

                // Validate expression
                if (!/^[0-9+\-*/.]+$/.test(expression)) {
                    throw new Error("Invalid expression");
                }

                // Calculate without eval()
                const result = calculateExpression(expression);

                if (!Number.isFinite(result)) {
                    throw new Error("Invalid calculation");
                }

                expression = String(result);
                input.value = expression;

            } catch (error) {

                input.value = "Error";
                expression = "";

            }
        }


        function calculateExpression(exp) {

            const numbers = exp.split(/[\+\-\*\/]/);
            const operatorsFound = exp.match(/[\+\-\*\/]/g) || [];

            if (numbers.length === 0) {
                throw new Error("Invalid expression");
            }

            let result = Number(numbers[0]);

            for (let i = 0; i < operatorsFound.length; i++) {

                const operator = operatorsFound[i];
                const nextNumber = Number(numbers[i + 1]);

                if (Number.isNaN(nextNumber)) {
                    throw new Error("Invalid number");
                }

                switch (operator) {

                    case "+":
                        result += nextNumber;
                        break;

                    case "-":
                        result -= nextNumber;
                        break;

                    case "*":
                        result *= nextNumber;
                        break;

                    case "/":
                        if (nextNumber === 0) {
                            throw new Error("Cannot divide by zero");
                        }

                        result /= nextNumber;
                        break;
                }
            }

            return result;
        }


        // Keyboard support
        document.addEventListener("keydown", (event) => {

            const key = event.key;

            if (
                (key >= "0" && key <= "9") ||
                operators.includes(key) ||
                key === "."
            ) {

                const button = [...buttons].find(
                    btn => btn.dataset.value === key
                );

                if (button) {
                    button.click();
                }

            } else if (key === "Enter" || key === "=") {

                calculate();

            } else if (key === "Backspace") {

                expression = expression.slice(0, -1);
                input.value = expression;

            } else if (key === "Escape") {

                expression = "";
                input.value = "";

            } else if (key === "%") {

                const percentButton =
                    [...buttons].find(
                        btn => btn.dataset.value === "%"
                    );

                percentButton.click();
            }

        });
