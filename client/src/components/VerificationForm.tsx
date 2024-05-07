import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = "https://otp-verification-8mfl.onrender.com";

function VerificationForm() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [codeError, setCodeError] = useState<boolean[]>(Array(6).fill(false));
  const [error, setError] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const focusOnEmptyInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setCodeError((prev) => {
      const newCodeError = [...prev];
      newCodeError[index] = false; // Set error to false on value change
      return newCodeError;
    });

    if (value !== "" && index < code.length - 1 && newCode[index] !== "") {
      focusOnEmptyInput(index + 1); // Shift to new box only if previous box is filled
    } else if (value === "" && index > 0 && newCode[index] !== "") {
      focusOnEmptyInput(index - 1); // Shift focus to the previous input
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Backspace" && index > 0 && code[index] === "") {
      const newCode = [...code];
      if (newCode[index] === "" && index > 0) {
        newCode[index - 1] = "";
        focusOnEmptyInput(index - 1);
        setCode(newCode);
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData("text/plain");
    if (!clipboardData) return;

    const newCode = [...code];
    let pasteIndex = inputRefs.current.findIndex(
      (ref) => ref === document.activeElement
    );

    if (pasteIndex === -1) {
      pasteIndex = 0;
    }

    for (
      let i = 0;
      i < clipboardData.length && pasteIndex < code.length;
      i++, pasteIndex++
    ) {
      newCode[pasteIndex] = clipboardData[i];
    }
    setCode(newCode);
  };

  const validateData = () => {
    let isValid = true;
    for (let i = 0; i < 6; i++) {
      if (code[i] === "" || code[i] === " " || isNaN(Number(code[i]))) {
        isValid = false;
        setCodeError((prev) => {
          const newCodeError = [...prev];
          newCodeError[i] = true;
          return newCodeError;
        });
      }
    }
    return isValid;
  };

  const handleSubmit = () => {
    const verificationCode = code.join("");
    if (!validateData()) return;
    axios
      .post(baseUrl + "/verify-code", { verificationCode })
      .then((res) => {
        setError(res.data.message);
        navigate("/success")
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  };

  return (
    <div className="flex flex-col gap-8 items-center text-center">
      <h1 className="text-3xl font-semibold text-violet-950">Verification Code</h1>
      <div className="flex flex-row gap-2">
        {code.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={value}
            className={`w-10 h-10 p-3 rounded-lg border-2 shadow-violet-950 shadow-md drop-shadow-xl outline-none text-center ${
              codeError[index] ? "border-red-500" : "border-white"
            }`}
            onChange={(e) => handleChange(index, e)}
            onPaste={handlePaste}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </div>
      <button onClick={handleSubmit} className="py-3 px-12 bg-violet-950 text-white text-lg rounded-xl uppercase">Submit</button>
      {error && <p className="text-red-500 font-semibold text-base">{error}</p>}
    </div>
  );
}

export default VerificationForm;
