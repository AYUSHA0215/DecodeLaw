"use client";

// imports
import { useState, useEffect } from "react";
import { RingLoader } from "react-spinners";
import OpenAI from "openai";


export default function Home() {

  // all var
  const [clause, setClause] = useState("");
  // const [prompt, setPrompt] = useState("");
  const [legalese, setLegalese] = useState("");
  const [susClauses, setSusClauses] = useState("");
  const [susExplanations, setSusExplanations] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [decode, setDecode] = useState("Decode");
  const [layman, setLayman] = useState("");
  const [arrLayman, setArrLayman] = useState([]);

  // on click
  const handleClick = async (e) => {

    e.preventDefault();

    // setDecode("Click Again to Confirm");

    // if (decode === "Click Again to Confirm")
    //   setIsLoading(true);

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
      dangerouslyAllowBrowser: true,
    });

    const prompt = 
      `Classify if the following legal clause is potentially harmful, helpful, or neutral. Explain why it is a potential threat
      Finally, rewrite the clause into a plain english sentence that a college student could understand. ${clause}. 
      Here is a sample clause: "Failure to adhere to the terms of this Agreement may result in the forfeiture of your entire security deposit without exception."
      Here is a sample explanation from that clause: "Potentially Harmful: If the tenant does not follow the terms of the agreement, they may lose their entire security deposit."
      Here is a sample rewrite from that clause: "If you don't follow the rules in this agreement, you might lose your whole security deposit, and there won't be any exceptions."
      Provide your response as a valid JSON object with the following schema:

      interface Response {
        clauses: Clause[]
      }

      interface Clause {
        originalClause: string
        explanation: string;
        laymanRewrite: string
      }

      EXAMPLES START

      {
        "clauses": [
          {
            "originalClause": "The tenant shall not sublet the premises without the prior written consent of the landlord.",
            "explanation": "Potentially Harmful: The tenant cannot rent out the property to someone else without the landlord's approval.",
            "laymanRewrite": "You can't rent out this place to someone else without getting the landlord's okay in writing first."
          },
          {
            "originalClause": "The landlord shall provide and maintain the premises in a good state of repair and fit for habitation during the tenancy.",
            "explanation": "Helpful: The landlord is responsible for keeping the property in good condition and suitable for living in.",
            "laymanRewrite": "The landlord has to keep the place in good shape and livable for the entire time you're renting."
          },
          {
            "originalClause": "The tenant agrees to use the premises solely for residential purposes.",
            "explanation": "Neutral: The tenant can only use the property for living in, not for business or other non-residential purposes.",
            "laymanRewrite": "You can only use this place to live in, not for running a business or anything else that's not about living."
          }
        ]
      }
      EXAMPLES END
    `

    setLegalese(clause);

    console.log("PROMPT", prompt)

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 3000
    });


    let json;


    console.log("completions", completion.choices[0].text)
    try {
      json = JSON.parse(completion.choices[0].text)
    } catch (e) {
      console.log(prompt)
      console.log("Error parsing JSON: ", e.message);
      console.log(completion.choices[0].text)
    }

    if (!json || !json.hasOwnProperty('clauses')) {
      console.log("JSON object is undefined or does not contain 'clauses' property: ", json);
    } else {
      setSusClauses(json["clauses"]);
    }

    console.log(json)

    setSusClauses(json["clauses"]);
    setSusExplanations(json["explanations"]);
    setLayman(json["rewrite"]);
    setArrLayman(layman.split('.'));

    console.log(arrLayman);

    setIsLoading(false);

  };

  return (

    <main className="">

      <div className="p-24">

        <label
          htmlFor="comment"
          className="block text-xl font-medium leading-6 font-bold text-gray-900"
          style={{ fontWeight: "bold" }}
        >
          Paste your rent agreement
        </label>

        <div className="mt-2">
          <textarea
            rows={5}
            name="comment"
            id="comment"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg leading-6"
            defaultValue={""}
            onChange={(e) => {
              setClause(e.target.value);
            }}
          />
        </div>

      </div>


      <button
        type="button"
        className="flex mx-auto rounded-md px-3.5 py-2.5 bg-black text-lg font-semibold text-white shadow-sm hover:bg-gray-800 transition ease-in-out duration-150"
        onClick={handleClick}
      >
        {decode}
      </button>

      {isLoading ? (
        <div className="sweet-loading" style={{ display: 'flex', justifyContent: 'center' }}>
          <RingLoader size={60} color={"#000000"} loading={isLoading} />
        </div>
      ) : (
        ""
      )}

      <div className="flex justify-between mt-1">

        {legalese.length > 0 && (
          <div className="flex w-2/3">
            <div className="text-center m-5">
              <h1 className="text-xl font-bold">Legal English</h1>

              {arrLayman.map((cl, index) => (

                <h1 style={{ color: "red" }} className="text-md mx-10 p-4 box-border border-black shadow-md" key={index}>
                  {arrLayman[index]}
                </h1>

              ))}

            </div>
          </div>
        )
        }

        <div className="mt-5">
          {susClauses.length > 0 && (

            <div>
              <h1 className="text-center font-bold text-xl">Explanation List</h1>
              <ul className="divide-y h-screen">

                {susClauses.map((cl) => (
                  
                    <li key={susClauses.indexOf(cl)} className="m-4 p-4 shadow-md">
                      <h1 className="font-bold">"{cl}"</h1>
                      <br />
                      {/* {susExplanations[susClauses.indexOf(cl)].includes("Harmful") && ( */}
                        <p style={{ color: "red" }}>{susExplanations[susClauses.indexOf(cl)]}</p>
                      {/* )} */}
                      {/* {susExplanations[susClauses.indexOf(cl)].includes("Helpful") && (
                        <p style={{ color: "green" }}>{susExplanations[susClauses.indexOf(cl)]}</p>
                      {/* )} */}
                      {/* {susExplanations[susClauses.indexOf(cl)].includes("Neutral") && ( */}
                        {/* <p style={{ color: "blue" }}>{susExplanations[susClauses.indexOf(cl)]}</p> */}
                      {/* )} */}
                      <p className="my-4">
                        <span className="font-bold">Layman's terms:</span> {layman[susClauses.indexOf(cl)]}
                      </p>
                    </li>
                  
                ))}
                `
              </ul>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
