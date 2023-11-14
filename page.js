"use client";

import { useState, useEffect } from "react";
import { RingLoader } from "react-spinners";
import OpenAI from "openai";

export default function Home() {
  const [clause, setClause] = useState("");
  const [prompt, setPrompt] = useState("");
  const [legalese, setLegalese] = useState("");
  const [susClauses, setSusClauses] = useState("");
  const [susExplanations, setSusExplanations] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [decode, setDecode] = useState("Decode");

  // stupid system for keeping track of conversions; doesnt work obv
  const [layman, setLayman] = useState([]);

  const handleClick = async (e) => {

    e.preventDefault();

    setDecode("Click Again to Confirm");

    if (decode === "Click Again to Confirm")
      setIsLoading(true);
    const openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    });

    setPrompt(
      `Classify if the following legal clause is potentially harmful, helpful, or neutral. Explain why it is a potential threat
      Also, explain what the clause means in plain English terms a blue collar worker could understand: ${clause}. 
      Here is a sample clause: "Failure to adhere to the terms of this Agreement may result in the forfeiture of your entire security deposit without exception."
      Here is a sample explanation from that clause: "Potentially Harmful: If the tenant does not follow the terms of the agreement, they may lose their entire security deposit."
      Provide your response as a JSON object with the following schema:
      { "clauses": ["", "", ...],"explanations": ["", "", ...]}`
    );
    
    setLegalese(clause);

    var completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 1000,
    });
    const json = JSON.parse(completion.choices[0].text);

    setSusClauses(json["clauses"]);
    setSusExplanations(json["explanations"]);
    setIsLoading(false);

    var laymansPrompt = `Rewrite this legal clause in plain English terms that a blue collar worker can understand: ${clause}`;
    
    var completion2 = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: laymansPrompt,
      temperature: 0.2,
      max_tokens: 1000
    });
    
    setLayman(completion2.choices[0].text);
  
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
          <div className="sweet-loading" style={{display: 'flex', justifyContent: 'center'}}>
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
              <h1 className="text-md mx-10 p-4 box-border border-black shadow-md">
                {legalese}
              </h1>
            </div>
          </div>
          )}

      <div className="mt-5">
        {susClauses.length > 0 && (
          <div>
            <h1 className="text-center font-bold text-xl">Explanation List</h1>
            <ul className="divide-y h-screen">
              {susClauses.map((cl) => (
                <li key={susClauses.indexOf(cl)} className="m-4 p-4 shadow-md">
                  <h1 className="font-bold">"{cl}"</h1>
                  <br />
                  <p>{susExplanations[susClauses.indexOf(cl)]}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      </div>
    </main>
  );
}